import easyocr as ocr
from typing import List


easyocr = ocr.Reader(['ru', 'en']) 

def predict(img_path: str) -> str:
    results_raw: List[str] = easyocr.readtext(img_path, detail=0, paragraph=True)
    return " ".join(results_raw)


# if __name__ == "__main__":
#     if torch.cuda.is_available():
#         print("GPU Name:", torch.cuda.get_device_name(0))
#         print("CUDA Device Count:", torch.cuda.device_count())
#     else:
#         print("CUDA не доступна")