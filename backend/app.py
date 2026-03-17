from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import uuid
from datetime import datetime
import base64
import cv2
import numpy as np
from supabase import create_client, Client
from predictor import DiseasePredictor
import config

app = FastAPI(title="Medical Diagnosis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase: Client = None
predictor: DiseasePredictor = None

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.on_event("startup")
async def startup_event():
    global supabase, predictor

    if config.SUPABASE_URL and config.SUPABASE_KEY:
        supabase = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)
        print("Supabase client initialized")
    else:
        print("Warning: Supabase credentials not found")

    if os.path.exists(config.MODEL_PATH):
        predictor = DiseasePredictor(config.MODEL_PATH)
        print(f"Model loaded from {config.MODEL_PATH}")
    else:
        print(f"Warning: Model not found at {config.MODEL_PATH}")
        print("Please train the model first using train_model.py")

@app.get("/")
async def root():
    return {
        "message": "Medical Diagnosis API",
        "version": "1.0.0",
        "status": "running",
        "model_loaded": predictor is not None
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": predictor is not None,
        "supabase_connected": supabase is not None
    }

@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    if predictor is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please train the model first."
        )

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="File must be an image"
        )

    try:
        file_id = str(uuid.uuid4())
        file_extension = file.filename.split(".")[-1]
        file_path = os.path.join(UPLOAD_DIR, f"{file_id}.{file_extension}")

        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        result = predictor.predict(file_path, generate_heatmap=True)

        heatmap_base64 = None
        if result.get("has_heatmap"):
            heatmap_img = result.pop("heatmap")
            _, buffer = cv2.imencode('.png', cv2.cvtColor(heatmap_img, cv2.COLOR_RGB2BGR))
            heatmap_base64 = base64.b64encode(buffer).decode('utf-8')

        if supabase:
            try:
                prediction_data = {
                    "id": file_id,
                    "predicted_class": result["predicted_class"],
                    "confidence": result["confidence"],
                    "disease_type": result["disease_type"],
                    "severity": result["severity"],
                    "is_normal": result["is_normal"],
                    "created_at": datetime.utcnow().isoformat()
                }
                supabase.table("predictions").insert(prediction_data).execute()
            except Exception as e:
                print(f"Error saving to Supabase: {e}")

        os.remove(file_path)

        response = {
            **result,
            "prediction_id": file_id,
            "heatmap": heatmap_base64,
            "timestamp": datetime.utcnow().isoformat()
        }

        return JSONResponse(content=response)

    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/predictions")
async def get_predictions(limit: int = 50):
    if supabase is None:
        raise HTTPException(
            status_code=503,
            detail="Supabase not configured"
        )

    try:
        response = supabase.table("predictions")\
            .select("*")\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()

        return {"predictions": response.data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
async def get_statistics():
    if supabase is None:
        raise HTTPException(
            status_code=503,
            detail="Supabase not configured"
        )

    try:
        response = supabase.table("predictions").select("*").execute()
        predictions = response.data

        total_predictions = len(predictions)

        disease_counts = {}
        for pred in predictions:
            disease = pred["predicted_class"]
            disease_counts[disease] = disease_counts.get(disease, 0) + 1

        normal_count = sum(1 for pred in predictions if pred["is_normal"])
        abnormal_count = total_predictions - normal_count

        avg_confidence = sum(pred["confidence"] for pred in predictions) / total_predictions if total_predictions > 0 else 0

        return {
            "total_predictions": total_predictions,
            "disease_distribution": disease_counts,
            "normal_count": normal_count,
            "abnormal_count": abnormal_count,
            "average_confidence": avg_confidence
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/diseases")
async def get_disease_info():
    return {
        "diseases": config.DISEASE_CATEGORIES,
        "supported_classes": config.DISEASE_CLASSES
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
