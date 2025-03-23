import torch
import numpy as np
from typing import Tuple

from torcheval.metrics import MulticlassAccuracy
from torcheval.metrics import MulticlassAUROC
from torcheval.metrics import MulticlassPrecision
from torcheval.metrics import MulticlassRecall
from torcheval.metrics import MulticlassF1Score

class MulticlassEvaluator:
    def __init__(self) -> None:
        pass
    
    def __call__(
        self,
        in_target: np.ndarray,
        in_output: np.ndarray,
    ) -> dict:
        
        in_target = torch.Tensor(in_target).type(dtype=torch.int64)
        in_output = torch.Tensor(in_output)
        
        # print(f"in_target.shape = {in_target.shape}")
        # print(f"in_output.shape = {in_output.shape}")
        
        ap, ar, mAP, mAR = self.compute_precision_recall(
            in_target, in_output
        )

        auc, m_auc = self.compute_auc(in_target, in_output)

        accuracy, m_accuracy = self.compute_accuracy(
            in_target, in_output
        )

        f1 = self.compute_f1(in_target, in_output)

        results = {
            "mAP": mAP,
            "mAR": mAR,
            "mAUC": m_auc,
            "m_Accuracy": m_accuracy,
            "ap": ap,
            "ar": ar,
            "auc": auc,
            "accuracy": accuracy,
            "f1": f1,
        }

        return results

    def compute_precision_recall(
        self,
        in_target,
        in_output,
    ) -> Tuple[np.ndarray, np.ndarray, float, float]:
        nb_classes = in_output.shape[1]

        ap = np.zeros((nb_classes,), dtype=np.float32)
        ar = np.zeros((nb_classes,), dtype=np.float32)

        metric_precision = MulticlassPrecision(num_classes=nb_classes, average=None)
        metric_precision.update(in_output, in_target)
        py_precision = metric_precision.compute()
        
        metric_recall = MulticlassRecall(num_classes=nb_classes, average=None)
        metric_recall.update(in_output, in_target)
        py_recall = metric_recall.compute()

        for class_index in range(nb_classes):
            ap[class_index] = py_precision[class_index]
            ar[class_index] = py_recall[class_index]

        mAP = ap.mean()
        mAR = ar.mean()
        return ap, ar, mAP, mAR

    def compute_auc(
        self,
        in_target,
        in_output,
    ) -> Tuple[np.ndarray, np.ndarray, float, float]:

        nb_classes = in_output.shape[1]

        aucs = np.zeros((nb_classes,), dtype=np.float32)

        metric = MulticlassAUROC(num_classes=nb_classes, average=None)
        metric.update(in_output, in_target)
        py_auc = metric.compute()

        for class_index in range(nb_classes):
            aucs[class_index] = py_auc[class_index]

        mAUC = aucs.mean()
        return aucs, mAUC

    def compute_accuracy(
        self,
        in_target,
        in_output,
    ) -> Tuple[np.ndarray, np.ndarray, float, float]:

        nb_classes = in_output.shape[1]

        accuracies = np.zeros((nb_classes,), dtype=np.float32)

        metric = MulticlassAccuracy(num_classes=nb_classes, average=None)
        metric.update(in_output, in_target)
        py_accuracies = metric.compute()

        for class_index in range(nb_classes):
            accuracies[class_index] = py_accuracies[class_index]

        mAccuracy = accuracies.mean()
        return accuracies, mAccuracy

    def compute_f1(
        self,
        in_target,
        in_output,
        threshold: float = 0.5,
    ) -> Tuple[float, float, float]:
        
        nb_classes = in_output.shape[1]
        
        f1 = {}
        
        metric_f1_micro = MulticlassF1Score(num_classes=nb_classes, average="micro")
        metric_f1_micro.update(in_output, in_target)
        f1["micro"] = metric_f1_micro.compute()

        metric_f1_macro = MulticlassF1Score(num_classes=nb_classes, average="macro")
        metric_f1_macro.update(in_output, in_target)
        f1["macro"] = metric_f1_macro.compute()

        metric_f1_none = MulticlassF1Score(num_classes=nb_classes, average=None)
        metric_f1_none.update(in_output, in_target)
        f1["none"] = metric_f1_none.compute()

        return f1
