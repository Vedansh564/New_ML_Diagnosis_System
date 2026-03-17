# AI Medical Diagnosis System

A full-stack AI-powered medical diagnosis web application that uses deep learning to automatically detect and classify multiple diseases from medical images.

## Features

- **Multi-Disease Detection**: Automatically detects 8 different conditions:
  - Pneumonia (Chest X-Ray)
  - Normal Chest (Chest X-Ray)
  - Diabetic Retinopathy (Retinal Image)
  - Normal Retina (Retinal Image)
  - Melanoma (Skin Lesion)
  - Benign Skin (Skin Lesion)
  - Brain Tumor (Brain MRI)
  - Normal Brain (Brain MRI)

- **Advanced Deep Learning**:
  - Transfer learning using EfficientNetB3
  - High accuracy with proper training and validation
  - Automated disease category detection (no manual selection needed)
  - Confidence scores and severity assessment

- **Visual Explanations**:
  - Grad-CAM heatmaps showing regions of interest
  - Visual overlay highlighting decision-making areas

- **Full-Stack Architecture**:
  - React frontend (Vite + TypeScript + Tailwind CSS)
  - FastAPI backend (Python)
  - Supabase database for predictions history
  - Real-time statistics and analytics

## Project Structure

```
project/
├── backend/
│   ├── app.py                  # FastAPI main application
│   ├── config.py               # Configuration settings
│   ├── train_model.py          # Model training script
│   ├── predictor.py            # Prediction module
│   ├── gradcam.py             # Grad-CAM visualization
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment variables template
│   ├── models/                # Saved models directory
│   └── uploads/               # Temporary upload directory
│
├── src/
│   ├── components/
│   │   ├── ImageUpload.tsx    # Image upload component
│   │   ├── ResultsDisplay.tsx # Results visualization
│   │   ├── HistoryView.tsx    # Predictions history
│   │   └── Statistics.tsx     # Statistics dashboard
│   ├── lib/
│   │   └── supabase.ts       # Supabase client
│   ├── App.tsx               # Main application
│   └── main.tsx              # Entry point
│
└── datasets/                  # Training datasets (to be added)
    ├── train/
    │   ├── Pneumonia/
    │   ├── Normal_Chest/
    │   ├── Diabetic_Retinopathy/
    │   ├── Normal_Retina/
    │   ├── Melanoma/
    │   ├── Benign_Skin/
    │   ├── Brain_Tumor/
    │   └── Normal_Brain/
    └── val/
        └── (same structure as train/)
```

## Installation

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- pip and virtualenv
- 8GB+ RAM recommended
- GPU recommended for training (CUDA-compatible)

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000
```

### Backend Setup

1. Create and activate virtual environment:
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `backend/.env`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
MODEL_PATH=./models/unified_disease_model.h5
```

## Dataset Preparation

### Recommended Datasets

1. **Pneumonia (Chest X-Ray)**:
   - [Chest X-Ray Images (Pneumonia)](https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia)

2. **Diabetic Retinopathy**:
   - [APTOS 2019 Blindness Detection](https://www.kaggle.com/c/aptos2019-blindness-detection)
   - [Diabetic Retinopathy Detection](https://www.kaggle.com/c/diabetic-retinopathy-detection)

3. **Melanoma (Skin Lesions)**:
   - [SIIM-ISIC Melanoma Classification](https://www.kaggle.com/c/siim-isic-melanoma-classification)
   - [HAM10000 Dataset](https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000)

4. **Brain Tumor (MRI)**:
   - [Brain Tumor MRI Dataset](https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset)
   - [Brain Tumor Classification (MRI)](https://www.kaggle.com/datasets/sartajbhuvaji/brain-tumor-classification-mri)

### Dataset Structure

Organize your datasets in the following structure:

```
datasets/
├── train/
│   ├── Pneumonia/          # ~3000+ images
│   ├── Normal_Chest/       # ~3000+ images
│   ├── Diabetic_Retinopathy/  # ~2000+ images
│   ├── Normal_Retina/      # ~2000+ images
│   ├── Melanoma/           # ~2000+ images
│   ├── Benign_Skin/        # ~2000+ images
│   ├── Brain_Tumor/        # ~2000+ images
│   └── Normal_Brain/       # ~2000+ images
└── val/
    └── (same structure, 20% of data)
```

**Important Notes**:
- Each folder should contain images in common formats (JPG, PNG)
- Aim for balanced classes (similar number of images per class)
- Split data 80% training, 20% validation
- Images will be automatically resized to 224x224 during training
- Minimum 1000 images per class recommended for good performance

## Model Training

### Training the Model

1. Ensure datasets are properly organized
2. Navigate to backend directory:
```bash
cd backend
```

3. Start training:
```bash
python train_model.py ../datasets/train ../datasets/val
```

### Training Process

The training script will:
1. Load and preprocess images with augmentation
2. Create EfficientNetB3 model with transfer learning
3. Train in two phases:
   - Phase 1: Frozen base model (20 epochs)
   - Phase 2: Fine-tuning (50 epochs total)
4. Save best model based on validation accuracy
5. Generate performance metrics:
   - Classification report (precision, recall, F1-score)
   - Confusion matrix visualization
   - Training history plots

### Expected Training Time

- With GPU (CUDA): 2-4 hours
- With CPU only: 8-24 hours (not recommended)

### Training Output

After training completes, you'll find:
- `models/unified_disease_model.h5` - Trained model
- `models/class_indices.json` - Class mappings
- `confusion_matrix.png` - Confusion matrix visualization
- `training_history.png` - Accuracy and loss curves

## Running the Application

### Start Backend Server

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

Backend will run on `http://localhost:8000`

### Start Frontend Development Server

In a new terminal:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Documentation

### Endpoints

#### `GET /`
Health check and API information

#### `GET /health`
System health status

#### `POST /predict`
Upload and analyze medical image

**Request**:
- Form data with `file` field (image file)

**Response**:
```json
{
  "predicted_class": "Pneumonia",
  "confidence": 0.95,
  "disease_type": "Chest X-Ray",
  "severity": "Moderate",
  "is_normal": false,
  "top_5_predictions": [...],
  "heatmap": "base64_encoded_image",
  "prediction_id": "uuid",
  "timestamp": "2024-01-01T00:00:00"
}
```

#### `GET /predictions?limit=50`
Get prediction history

#### `GET /stats`
Get system statistics

#### `GET /diseases`
Get supported diseases information

## Model Performance

### Model Architecture

- **Base Model**: EfficientNetB3 (ImageNet pre-trained)
- **Custom Layers**:
  - GlobalAveragePooling2D
  - Dense(512, relu) + Dropout(0.5)
  - Dense(256, relu) + Dropout(0.3)
  - Dense(8, softmax)

### Training Configuration

- **Image Size**: 224x224
- **Batch Size**: 32
- **Optimizer**: Adam (lr=0.001, fine-tune=0.0001)
- **Loss**: Categorical Crossentropy
- **Augmentation**:
  - Rotation: ±30°
  - Width/Height shift: 20%
  - Zoom: 20%
  - Horizontal flip
  - Brightness: 80-120%

### Expected Performance

With proper training:
- Overall Accuracy: 90-95%
- Per-class Precision: 85-98%
- Per-class Recall: 85-98%
- F1-Score: 85-95%

## Deployment

### Backend Deployment

1. Set environment variables on your server
2. Install Python dependencies
3. Ensure model file is accessible
4. Run with production ASGI server:
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend Deployment

1. Build the frontend:
```bash
npm run build
```

2. Deploy `dist/` directory to your hosting service
3. Update `VITE_API_URL` to point to your production API

### Recommended Services

- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Backend**: Railway, Render, AWS EC2, Google Cloud Run
- **Database**: Supabase (already configured)

## Usage

1. Navigate to the application in your browser
2. Click "Upload & Diagnose" tab
3. Drag and drop or select a medical image
4. Wait for analysis (typically 2-5 seconds)
5. View results including:
   - Predicted diagnosis
   - Confidence score
   - Disease type and severity
   - Grad-CAM heatmap visualization
   - Top 5 predictions
6. Check "History" tab for past predictions
7. View "Statistics" for analytics

## Important Disclaimers

- This system is for **educational and research purposes only**
- **Not approved for clinical use**
- Always consult qualified healthcare professionals for medical advice
- AI predictions should not replace professional medical diagnosis
- This tool is meant to assist, not replace, medical expertise

## Troubleshooting

### Model Not Loading

**Issue**: "Model not loaded" error

**Solutions**:
- Ensure model file exists at `backend/models/unified_disease_model.h5`
- Check `MODEL_PATH` in backend `.env`
- Verify model was successfully trained
- Check file permissions

### Low Prediction Accuracy

**Solutions**:
- Ensure sufficient training data (1000+ images per class)
- Verify data quality and correct labeling
- Balance dataset (similar number of images per class)
- Train for more epochs
- Try data augmentation variations

### CORS Errors

**Solutions**:
- Verify backend is running on correct port
- Check `VITE_API_URL` in frontend `.env`
- Ensure CORS middleware is enabled in FastAPI

### Supabase Connection Issues

**Solutions**:
- Verify Supabase credentials in `.env` files
- Check database table was created correctly
- Ensure RLS policies allow access
- Test connection with Supabase dashboard

### Out of Memory During Training

**Solutions**:
- Reduce batch size in `config.py`
- Use smaller image size
- Close other applications
- Use system with more RAM
- Enable swap space

## Performance Optimization

### Frontend
- Images are automatically compressed before upload
- Lazy loading for history view
- Optimized re-renders with React hooks

### Backend
- Efficient image preprocessing
- Model loaded once at startup
- Async request handling
- Response caching possible

## Future Enhancements

- User authentication and private predictions
- Multi-language support
- More disease types
- Ensemble models for higher accuracy
- Real-time collaboration features
- Mobile app version
- DICOM format support
- PDF report generation

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please check dataset licenses for commercial use restrictions.

## Support

For issues, questions, or contributions:
- Check troubleshooting section
- Review API documentation
- Consult training logs
- Check backend logs for errors

## Acknowledgments

- EfficientNet architecture by Google Research
- Grad-CAM visualization technique
- Open-source medical imaging datasets
- Supabase for backend infrastructure
- FastAPI and React communities

---

Built with modern deep learning and full-stack technologies for advancing medical AI research and education.
