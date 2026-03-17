import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
MODEL_PATH = os.getenv("MODEL_PATH", "./models/unified_disease_model.h5")

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 50

DISEASE_CLASSES = [
    "Pneumonia",
    "Normal_Chest",
    "Diabetic_Retinopathy",
    "Normal_Retina",
    "Melanoma",
    "Benign_Skin",
    "Brain_Tumor",
    "Normal_Brain"
]

DISEASE_CATEGORIES = {
    "Pneumonia": {"type": "Chest X-Ray", "severity_levels": ["Mild", "Moderate", "Severe"]},
    "Normal_Chest": {"type": "Chest X-Ray", "severity_levels": []},
    "Diabetic_Retinopathy": {"type": "Retinal Image", "severity_levels": ["Mild", "Moderate", "Severe", "Proliferative"]},
    "Normal_Retina": {"type": "Retinal Image", "severity_levels": []},
    "Melanoma": {"type": "Skin Lesion", "severity_levels": ["Stage I", "Stage II", "Stage III", "Stage IV"]},
    "Benign_Skin": {"type": "Skin Lesion", "severity_levels": []},
    "Brain_Tumor": {"type": "Brain MRI", "severity_levels": ["Grade I", "Grade II", "Grade III", "Grade IV"]},
    "Normal_Brain": {"type": "Brain MRI", "severity_levels": []}
}
