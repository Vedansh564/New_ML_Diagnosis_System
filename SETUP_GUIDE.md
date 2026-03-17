# Complete Setup Guide

This guide will walk you through setting up the entire AI Medical Diagnosis System from scratch.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ and **npm** installed
- **Python** 3.9+ installed
- **pip** and **virtualenv** installed
- **Git** (optional, for version control)
- **8GB+ RAM** (16GB recommended for training)
- **GPU with CUDA** (optional but highly recommended for training)
- **20-50GB free disk space** (for datasets and models)

## Part 1: Environment Setup

### Step 1.1: Clone/Download Project

If using Git:
```bash
git clone <repository-url>
cd project
```

Or simply navigate to your project directory.

### Step 1.2: Install Frontend Dependencies

```bash
npm install
```

This will install:
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Supabase client
- Lucide React (icons)

### Step 1.3: Setup Backend Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

This will install:
- FastAPI (web framework)
- TensorFlow 2.15 (deep learning)
- Pillow, OpenCV (image processing)
- NumPy, scikit-learn (data processing)
- Supabase client (database)

## Part 2: Database Setup

### Step 2.1: Supabase Account

1. Go to https://supabase.com
2. Sign up or log in
3. Create a new project
4. Wait for provisioning (2-3 minutes)

### Step 2.2: Get Credentials

From your Supabase dashboard:

1. Click on "Settings" (gear icon)
2. Go to "API" section
3. Copy:
   - Project URL
   - anon/public key

### Step 2.3: Configure Environment Variables

**Frontend** - Create `.env` in project root:
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:8000
```

**Backend** - Create `.env` in backend folder:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
SUPABASE_URL=your_project_url_here
SUPABASE_KEY=your_anon_key_here
MODEL_PATH=./models/unified_disease_model.h5
```

### Step 2.4: Verify Database

The database table (`predictions`) should already be created automatically. To verify:

1. Go to Supabase dashboard
2. Click "Table Editor"
3. You should see "predictions" table

## Part 3: Dataset Preparation

### Step 3.1: Create Dataset Structure

Run this Python script to create folders:

```python
# organize_datasets.py
from pathlib import Path

base_path = Path('datasets')
splits = ['train', 'val']
classes = [
    'Pneumonia', 'Normal_Chest',
    'Diabetic_Retinopathy', 'Normal_Retina',
    'Melanoma', 'Benign_Skin',
    'Brain_Tumor', 'Normal_Brain'
]

for split in splits:
    for class_name in classes:
        (base_path / split / class_name).mkdir(parents=True, exist_ok=True)

print("Dataset structure created!")
```

Run:
```bash
python organize_datasets.py
```

### Step 3.2: Download Datasets

Follow the detailed instructions in `DATASET_GUIDE.md` to download and organize:

1. **Chest X-rays** (Pneumonia dataset from Kaggle)
2. **Retinal images** (APTOS or Diabetic Retinopathy dataset)
3. **Skin lesions** (ISIC Melanoma dataset)
4. **Brain MRI** (Brain Tumor dataset)

**Quick links:**
- Pneumonia: https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia
- Retinopathy: https://www.kaggle.com/c/aptos2019-blindness-detection
- Melanoma: https://www.kaggle.com/c/siim-isic-melanoma-classification
- Brain Tumor: https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset

### Step 3.3: Organize Images

After downloading:

1. Extract all datasets
2. Copy images to appropriate folders
3. Ensure train/val split is 80/20
4. Aim for 1000+ images per class

**Verify structure:**
```bash
ls -R datasets/
```

Should show:
```
datasets/
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
    └── (same structure)
```

## Part 4: Model Training

### Step 4.1: Verify Setup

Before training:

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
```

Check GPU (optional):
```python
python -c "import tensorflow as tf; print('GPUs:', tf.config.list_physical_devices('GPU'))"
```

### Step 4.2: Start Training

```bash
python train_model.py ../datasets/train ../datasets/val
```

**What happens:**
1. Loads images with augmentation
2. Creates EfficientNetB3 model
3. Trains with frozen base (20 epochs)
4. Fine-tunes model (30 more epochs)
5. Generates performance metrics
6. Saves best model

**Expected time:**
- With GPU: 2-4 hours
- Without GPU: 10-24 hours

**Monitor progress:**
- Watch accuracy/loss in terminal
- Training will auto-save best model
- Early stopping prevents overfitting

### Step 4.3: Verify Training Results

After training completes, check:

```bash
ls models/
# Should see:
# - unified_disease_model.h5
# - class_indices.json

ls *.png
# Should see:
# - confusion_matrix.png
# - training_history.png
```

Open these PNG files to inspect:
- **confusion_matrix.png**: Shows prediction accuracy per class
- **training_history.png**: Shows learning curves

**Good signs:**
- Validation accuracy > 85%
- Training and validation curves converge
- Low confusion between classes

**Bad signs:**
- Large gap between train/val accuracy (overfitting)
- Validation accuracy < 70% (need more data or training)
- High confusion between classes (data quality issues)

## Part 5: Running the Application

### Step 5.1: Start Backend Server

In one terminal:

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Option 1: Direct
python app.py

# Option 2: Using start script (Unix)
chmod +x start_server.sh
./start_server.sh

# Option 3: Using start script (Windows)
start_server.bat
```

Server should start on http://localhost:8000

**Verify backend:**
```bash
curl http://localhost:8000/health
```

Should return:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "supabase_connected": true
}
```

### Step 5.2: Start Frontend Development Server

In another terminal:

```bash
# From project root
npm run dev
```

Frontend should start on http://localhost:5173

### Step 5.3: Access Application

Open browser and go to:
```
http://localhost:5173
```

You should see the AI Medical Diagnosis System interface!

## Part 6: Testing the System

### Test 1: Upload Image

1. Click "Upload & Diagnose" tab
2. Drag and drop or select a test medical image
3. Wait for analysis (2-5 seconds)
4. Verify results show:
   - Predicted diagnosis
   - Confidence score
   - Grad-CAM heatmap
   - Top 5 predictions

### Test 2: Check History

1. Click "History" tab
2. Verify your prediction appears
3. Check timestamp and details

### Test 3: View Statistics

1. Click "Statistics" tab
2. Verify stats are displayed:
   - Total predictions
   - Normal vs abnormal counts
   - Disease distribution

### Test 4: API Endpoints

Test using curl or Postman:

```bash
# Health check
curl http://localhost:8000/health

# Get predictions
curl http://localhost:8000/predictions

# Get statistics
curl http://localhost:8000/stats

# Get disease info
curl http://localhost:8000/diseases

# Make prediction
curl -X POST -F "file=@test_image.jpg" http://localhost:8000/predict
```

## Part 7: Troubleshooting

### Frontend won't start
- Check Node.js version: `node --version` (need 18+)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for port conflicts on 5173

### Backend won't start
- Check Python version: `python --version` (need 3.9+)
- Verify virtual environment is activated
- Check requirements installed: `pip list`
- Verify model file exists: `ls backend/models/`

### Model not loading
- Ensure `unified_disease_model.h5` exists in `backend/models/`
- Check MODEL_PATH in backend `.env`
- Verify file isn't corrupted (re-train if needed)

### Predictions failing
- Check backend logs for errors
- Verify image format (JPG, PNG supported)
- Test with sample images from training set
- Check API URL in frontend `.env`

### Supabase errors
- Verify credentials in both `.env` files
- Check Supabase project is active
- Test connection in Supabase dashboard
- Verify RLS policies allow access

### Low accuracy
- Need more training data (aim for 2000+ per class)
- Check data quality and labeling
- Train for more epochs
- Verify class balance
- Try different hyperparameters

### Out of memory during training
- Reduce batch size in `config.py`
- Close other applications
- Use smaller image size
- Train on GPU if possible

## Part 8: Production Deployment

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Set environment variables in Vercel dashboard
5. Deploy

### Backend Deployment (Railway)

1. Create account at https://railway.app
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy
5. Note the deployment URL
6. Update frontend `VITE_API_URL`

### Alternative: Docker Deployment

Create `Dockerfile` for backend:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t medical-diagnosis-api .
docker run -p 8000:8000 medical-diagnosis-api
```

## Part 9: Maintenance

### Regular Tasks

**Daily:**
- Monitor prediction history
- Check API health
- Review error logs

**Weekly:**
- Analyze statistics
- Check model performance
- Review new predictions

**Monthly:**
- Retrain model with new data
- Update dependencies
- Backup database

### Model Updates

To retrain with new data:

1. Add new images to datasets
2. Re-run training script
3. Test new model thoroughly
4. Replace old model file
5. Restart backend server

### Database Maintenance

```sql
-- Clean old predictions (optional)
DELETE FROM predictions WHERE created_at < NOW() - INTERVAL '90 days';

-- View statistics
SELECT predicted_class, COUNT(*) FROM predictions GROUP BY predicted_class;
```

## Part 10: Next Steps

After setup is complete:

1. **Collect more data** for better accuracy
2. **Fine-tune hyperparameters** in `config.py`
3. **Add user authentication** for privacy
4. **Implement PDF reports** for predictions
5. **Add more disease types** as needed
6. **Deploy to production** for real use
7. **Gather user feedback** and iterate

## Support Resources

- Main README: `README.md`
- Dataset Guide: `DATASET_GUIDE.md`
- Backend API Docs: `http://localhost:8000/docs` (when running)
- TensorFlow Docs: https://www.tensorflow.org/
- FastAPI Docs: https://fastapi.tiangolo.com/
- React Docs: https://react.dev/

## Quick Reference

**Start development:**
```bash
# Terminal 1 (Backend)
cd backend && source venv/bin/activate && python app.py

# Terminal 2 (Frontend)
npm run dev
```

**Train model:**
```bash
cd backend && python train_model.py ../datasets/train ../datasets/val
```

**Build for production:**
```bash
npm run build
```

**Check logs:**
```bash
# Backend logs in terminal where app.py is running
# Frontend logs in browser console (F12)
```

---

Congratulations! Your AI Medical Diagnosis System is now fully set up and ready to use!
