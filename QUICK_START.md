# Quick Start Guide

Get your AI Medical Diagnosis System up and running in minutes.

## Prerequisites

- Node.js 18+
- Python 3.9+
- 8GB+ RAM

## 5-Minute Setup (Frontend Only - Demo Mode)

To quickly see the UI without training a model:

1. **Install frontend dependencies:**
```bash
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:8000
```

3. **Start frontend:**
```bash
npm run dev
```

4. **Open browser:**
```
http://localhost:5173
```

Note: Predictions will fail without backend running.

## Complete Setup (With Model Training)

### Step 1: Install Dependencies (5 minutes)

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Configure Environment (2 minutes)

**Frontend `.env`:**
```bash
cp .env.example .env
# Add your Supabase URL and key
```

**Backend `.env`:**
```bash
cd backend
cp .env.example .env
# Add your Supabase URL and key
```

### Step 3: Prepare Datasets (1-3 hours)

Follow `DATASET_GUIDE.md` to:
1. Download medical image datasets
2. Organize into proper folder structure
3. Aim for 1000+ images per class

**Quick structure setup:**
```bash
mkdir -p datasets/{train,val}/{Pneumonia,Normal_Chest,Diabetic_Retinopathy,Normal_Retina,Melanoma,Benign_Skin,Brain_Tumor,Normal_Brain}
```

### Step 4: Train Model (2-4 hours with GPU)

```bash
cd backend
source venv/bin/activate
python train_model.py ../datasets/train ../datasets/val
```

Wait for training to complete. This will:
- Train a high-accuracy EfficientNetB3 model
- Generate performance metrics
- Save model to `backend/models/`

### Step 5: Start Backend (30 seconds)

```bash
cd backend
source venv/bin/activate
python app.py
```

Backend runs on `http://localhost:8000`

### Step 6: Start Frontend (30 seconds)

In a new terminal:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Step 7: Test the System (2 minutes)

1. Open `http://localhost:5173`
2. Upload a test medical image
3. View prediction results
4. Check history and statistics tabs

## Running Commands Cheat Sheet

**Start everything:**
```bash
# Terminal 1 - Backend
cd backend && source venv/bin/activate && python app.py

# Terminal 2 - Frontend
npm run dev
```

**Train new model:**
```bash
cd backend && python train_model.py ../datasets/train ../datasets/val
```

**Build for production:**
```bash
npm run build
```

**Check backend health:**
```bash
curl http://localhost:8000/health
```

## Test with Sample Images

**Where to get test images:**
- Use images from validation set
- Download from dataset sources
- Use your own medical images

**Supported formats:**
- JPG, JPEG, PNG
- Any size (will be resized)

**Test different disease types:**
1. Chest X-rays (pneumonia detection)
2. Retinal images (diabetic retinopathy)
3. Skin lesions (melanoma detection)
4. Brain MRI (tumor detection)

## Troubleshooting Quick Fixes

**Frontend won't start:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Backend errors:**
```bash
cd backend
deactivate
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Model not found:**
- Ensure training completed successfully
- Check `backend/models/unified_disease_model.h5` exists
- Verify MODEL_PATH in backend `.env`

**Supabase connection failed:**
- Double-check credentials in `.env` files
- Verify Supabase project is active
- Test connection in Supabase dashboard

## Next Steps

After setup:

1. Read `README.md` for detailed documentation
2. Review `ARCHITECTURE.md` for technical details
3. Check `DATASET_GUIDE.md` for dataset preparation
4. Explore `SETUP_GUIDE.md` for comprehensive instructions

## Getting Help

- Check documentation files
- Review error messages in terminal
- Verify all prerequisites are installed
- Ensure datasets are properly organized
- Check backend logs for API errors

## Production Deployment

Once tested locally, deploy:

**Frontend:**
```bash
npm run build
# Deploy dist/ folder to Vercel/Netlify
```

**Backend:**
- Deploy to Railway/Render/AWS
- Set environment variables
- Upload trained model
- Update frontend API_URL

For detailed deployment instructions, see `README.md`.

---

You're now ready to use your AI Medical Diagnosis System!
