import torch
import torchvision.transforms as transforms
import argparse
from PIL import Image
import random
import torch.backends.cudnn as cudnn
from vpt_vit import vpt_vit_base


if __name__ == "__main__":
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    seed = 7
    if seed is not None:
        random.seed(seed)
        torch.manual_seed(seed)
        cudnn.deterministic = True

    parser = argparse.ArgumentParser(description="Simple script with arguments.")
    parser.add_argument("--pr", type=int, help="Prompt length")
    parser.add_argument("--img_path", type=str, help="Learning rate")
    parser.add_argument(
        "--ckp_path",
        type=str,
        help="Learning rate",
    )
    args = parser.parse_args()

    # Hyperparameters
    IMG_SIZE = 224

    # Data Transforms
    transform = transforms.Compose(
        [
            transforms.Resize((IMG_SIZE, IMG_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )

    model = vpt_vit_base(int(args.pr), 5)
    model = model.to(device)
    state_dict = torch.load(args.ckp_path, map_location=device)
    model.load_state_dict(state_dict["state_dict"], strict=False)
    model.eval()

    image = Image.open(args.img_path).convert("RGB")
    image = transform(image)
    image:torch.Tensor = image.to(device)
    image = image.unsqueeze_(0)
    output = model(image)

    prediction = torch.softmax(output, dim=1)
    prediction = int(torch.argmax(prediction))
    prediction_string = str(prediction)

    if prediction == 4:
        prediction_string = "no_damage"
    elif prediction == 3:
        prediction_string = "minor"
    elif prediction == 2:
        prediction_string = "major"
    elif prediction == 1:
        prediction_string = "destroyed"
    elif prediction == 0:
        prediction_string = "affected"

    # scripted_model = torch.jit.script(model)
    # scripted_model.save(str(args.ckp_path) + ".mar")
    # torch.save(
    #     {
    #         "state_dict": model.state_dict(),
    #     },
    #     str(args.ckp_path) + ".new",
    # )

    print(f"Prediction for {args.img_path} : {prediction_string}")
    print(f"{prediction_string}")
    print(f"{prediction}")
    exit(prediction)
