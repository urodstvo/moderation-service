import onnxruntime as ort
from typing import Union
import numpy as np
import cv2
from PIL import Image

from typing import TypedDict, List

from ultralytics import YOLO


class Result(TypedDict):
    classificator: str
    score: str

model = YOLO("yolo11n.pt")

def predict(img: Union[str, np.ndarray, Image.Image]) -> List[Result]:
    preds = model(img)
    results: List[Result] = []

    if not preds:
        return results

    boxes = preds[0].boxes
    if boxes is None or boxes.data.shape[0] == 0:
        return results

    for cls_id_tensor, conf_tensor in zip(boxes.cls, boxes.conf):
        cls_id = int(cls_id_tensor.item())
        conf = float(conf_tensor.item())
        label = model.names[cls_id]

        results.append({
            "classificator": label,
            "score": f"{conf:.2f}"
        })

    return results
