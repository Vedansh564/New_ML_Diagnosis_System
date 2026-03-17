import numpy as np
import tensorflow as tf
from PIL import Image
import cv2
import json
import os
from gradcam import generate_gradcam
import config

class DiseasePredictor:
    def __init__(self, model_path, class_indices_path='models/class_indices.json'):
        self.model = tf.keras.models.load_model(model_path)

        if os.path.exists(class_indices_path):
            with open(class_indices_path, 'r') as f:
                self.class_indices = json.load(f)
                self.class_names = {v: k for k, v in self.class_indices.items()}
        else:
            self.class_names = {i: name for i, name in enumerate(config.DISEASE_CLASSES)}

    def preprocess_image(self, image_path):
        img = Image.open(image_path).convert('RGB')

        original_img = cv2.imread(image_path)
        original_img = cv2.cvtColor(original_img, cv2.COLOR_BGR2RGB)

        img = img.resize(config.IMAGE_SIZE)
        img_array = np.array(img)
        img_array = img_array / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        return img_array, original_img

    def predict(self, image_path, generate_heatmap=True):
        img_array, original_img = self.preprocess_image(image_path)

        predictions = self.model.predict(img_array, verbose=0)

        class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][class_idx])
        predicted_class = self.class_names.get(class_idx, f"Unknown_{class_idx}")

        top_5_indices = np.argsort(predictions[0])[-5:][::-1]
        top_5_predictions = [
            {
                "class": self.class_names.get(idx, f"Unknown_{idx}"),
                "confidence": float(predictions[0][idx])
            }
            for idx in top_5_indices
        ]

        disease_info = config.DISEASE_CATEGORIES.get(predicted_class, {
            "type": "Unknown",
            "severity_levels": []
        })

        severity = None
        if disease_info["severity_levels"] and "Normal" not in predicted_class:
            if confidence > 0.9:
                severity = disease_info["severity_levels"][-1] if len(disease_info["severity_levels"]) > 0 else None
            elif confidence > 0.7:
                mid_idx = len(disease_info["severity_levels"]) // 2
                severity = disease_info["severity_levels"][mid_idx] if mid_idx < len(disease_info["severity_levels"]) else None
            else:
                severity = disease_info["severity_levels"][0] if len(disease_info["severity_levels"]) > 0 else None

        result = {
            "predicted_class": predicted_class,
            "confidence": confidence,
            "disease_type": disease_info["type"],
            "severity": severity,
            "top_5_predictions": top_5_predictions,
            "is_normal": "Normal" in predicted_class
        }

        if generate_heatmap:
            try:
                overlay, heatmap = generate_gradcam(self.model, img_array, original_img, class_idx)
                result["has_heatmap"] = True
                result["heatmap"] = overlay
            except Exception as e:
                print(f"Error generating Grad-CAM: {e}")
                result["has_heatmap"] = False

        return result
