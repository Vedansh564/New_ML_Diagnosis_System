# Backend API Documentation

## Quick Start

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Train model (required before first run):
```bash
python train_model.py ../datasets/train ../datasets/val
```

4. Run server:
```bash
python app.py
```

## API Endpoints

### Health Check
```
GET /
GET /health
```

### Prediction
```
POST /predict
Content-Type: multipart/form-data

Body: file (image)
```

### History
```
GET /predictions?limit=50
```

### Statistics
```
GET /stats
```

### Disease Info
```
GET /diseases
```

## Model Training

### Command
```bash
python train_model.py <train_dir> <val_dir>
```

### Example
```bash
python train_model.py ../datasets/train ../datasets/val
```

### Output
- `models/unified_disease_model.h5` - Trained model
- `models/class_indices.json` - Class mappings
- `confusion_matrix.png` - Confusion matrix
- `training_history.png` - Training curves

## Configuration

Edit `config.py` to customize:
- Image size
- Batch size
- Number of epochs
- Disease classes
- Severity levels

## Requirements

- Python 3.9+
- TensorFlow 2.15+
- FastAPI
- Pillow
- OpenCV
- NumPy
- scikit-learn

See `requirements.txt` for complete list.
