import torch
import torch.nn as nn
import torch.optim as optim
import torchvision.transforms as transforms
import torchvision.datasets as datasets
from torch.utils.data import DataLoader, ConcatDataset, random_split
from timm.scheduler.cosine_lr import CosineLRScheduler
from multiclass_evaluator import MulticlassEvaluator
import argparse
import os
import pathlib
from vpt_vit import vpt_vit_base
import random
import torch.backends.cudnn as cudnn

if __name__ == "__main__":
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    seed = 7
    if seed is not None:
        random.seed(seed)
        torch.manual_seed(seed)
        cudnn.deterministic = True

    parser = argparse.ArgumentParser(description="Simple script with arguments.")
    parser.add_argument("--lr", type=float, default=1e-4, help="Learning rate")
    parser.add_argument("--wd", type=float, default=1e-4, help="weight decay")
    parser.add_argument("--pr", type=int, default=10, help="prompt length")
    parser.add_argument("--backbone", type=str, help="path to backbone")
    parser.add_argument("--data_root", type=str, default="", help="path to output")
    parser.add_argument("--data_csv_root", type=str, default="", help="path to csv")
    args = parser.parse_args()

    # Hyperparameters
    BATCH_SIZE = 32
    LR = args.lr
    LR = LR * BATCH_SIZE / 256
    WD = args.wd
    WARM_EPOCHS = 10
    EPOCHS = 50
    IMG_SIZE = 224

    # Data Transforms
    transform = transforms.Compose(
        [
            transforms.Resize((IMG_SIZE, IMG_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )

    # Custom Dataset (Ensure your dataset is structured properly)
    datasets_list = []
    for dataset_csv in [
        "AUG",
        "BEA",
        "BEU",
        "CAL",
        "CAS",
        "CRE",
        "DIN",
        "DIX",
        "FAI",
        "FOR",
        "GLA",
        "MIL",
        "MON",
        "MOS",
        "SCU",
        "VAL",
    ]:
        root_to_csv = args.data_csv_root
        csv_file = root_to_csv + dataset_csv
        datasets_list.append(datasets.ImageFolder(root=csv_file, transform=transform))

    # Concatenate datasets
    combined_dataset = ConcatDataset(datasets_list)

    train_size = int(0.8 * len(combined_dataset)) 
    test_size = len(combined_dataset) - train_size  

    print(f"Train size = {train_size}, Test size = {test_size}")

    # Perform train test split
    train_dataset, test_dataset = random_split(
        combined_dataset,
        [train_size, test_size],
        generator=torch.Generator().manual_seed(7),
    )

    # Create dataLoaders for train and test
    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=4,
        pin_memory=True,
    )
    test_loader = DataLoader(
        test_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=4,
        pin_memory=True,
    )

    print(f"Classes : {datasets_list[0].classes}")
    print(f"Class to index : {datasets_list[0].class_to_idx}")

    # Create the model
    model = vpt_vit_base(args.pr, len(datasets_list[0].classes))
    model = model.to(device)
    path_to_model = args.backbone
    model.load_pretrained(path_to_model)

    # Loss, optimizer, and scheduler
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.SGD(model.parameters(), lr=LR, weight_decay=WD, momentum=0.9)
    scheduler = CosineLRScheduler(
        optimizer,
        EPOCHS,
        warmup_t=WARM_EPOCHS,
    )

    mlc_eval = MulticlassEvaluator()
    for epoch in range(EPOCHS):
        total_loss, correct, total = 0, 0, 0
        model.train()
        for images, labels in train_loader:

            images, labels = images.to(device), labels.to(device)
            outputs = model(images)

            loss = criterion(outputs, labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            scheduler.step(epoch + 1)
            total_loss += loss.item()

        print(
            f"Training : Epoch [{epoch+1}/{EPOCHS}], Loss: {total_loss/len(train_loader):.4f}"
        )

        outputs_list = list()
        targets_list = list()
        model.eval()
        for images, labels in test_loader:

            images, labels = images.to(device), labels.to(device)
            outputs = model(images)

            loss = criterion(outputs, labels)
            total_loss += loss.item()

            outputs_list.extend(list(outputs.detach().cpu().numpy()))
            targets_list.extend(list(labels.detach().cpu().numpy()))

        results = mlc_eval(targets_list, outputs_list)
        
        print(
            f"Testing : Epoch [{epoch+1}/{EPOCHS}], Loss: {total_loss/len(train_loader):.4f}, results: {results}"
        )

        if ((epoch % 10 == 0) or ((epoch + 1) == EPOCHS)) and (epoch > 0):
            
            dir_name = str(args.lr) + "_" + str(args.wd) + "_" + str(args.pr)
            
            path_to_dir = pathlib.Path(str(args.data_root) + "./data/training/" + dir_name)
            path_to_save = path_to_dir.joinpath("checkpoint_" + str(epoch) + ".pt")
            
            if not path_to_dir.is_dir():
                os.mkdir(path_to_dir)
                
            print(f"Saving {path_to_save}")
            torch.save(
                {
                    "epoch": epoch,
                    "results": results,
                    "state_dict": model.state_dict(),
                },
                path_to_save,
            )
