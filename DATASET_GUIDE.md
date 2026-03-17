# Dataset Preparation Guide

This guide will help you prepare the datasets needed to train the medical diagnosis model.

## Overview

You need to collect and organize medical images for 8 different classes:

1. **Pneumonia** - Chest X-rays showing pneumonia
2. **Normal_Chest** - Normal/healthy chest X-rays
3. **Diabetic_Retinopathy** - Retinal images with diabetic retinopathy
4. **Normal_Retina** - Normal/healthy retinal images
5. **Melanoma** - Skin lesion images with melanoma
6. **Benign_Skin** - Benign skin lesion images
7. **Brain_Tumor** - Brain MRI scans with tumors
8. **Normal_Brain** - Normal brain MRI scans

## Recommended Data Sources

### 1. Chest X-Ray (Pneumonia Detection)

**Kaggle - Chest X-Ray Images (Pneumonia)**
- URL: https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia
- Size: ~5,863 images
- Classes: PNEUMONIA, NORMAL
- Format: JPEG

**How to use:**
1. Download the dataset
2. Extract files
3. Copy images:
   - `train/PNEUMONIA/*` → `datasets/train/Pneumonia/`
   - `train/NORMAL/*` → `datasets/train/Normal_Chest/`
   - `test/PNEUMONIA/*` → `datasets/val/Pneumonia/`
   - `test/NORMAL/*` → `datasets/val/Normal_Chest/`

### 2. Diabetic Retinopathy

**Kaggle - APTOS 2019 Blindness Detection**
- URL: https://www.kaggle.com/c/aptos2019-blindness-detection
- Size: ~3,662 training images
- Classes: 0 (No DR) to 4 (Proliferative DR)
- Format: PNG

**Alternative: Diabetic Retinopathy Detection**
- URL: https://www.kaggle.com/c/diabetic-retinopathy-detection
- Size: ~35,126 training images (larger dataset)

**How to use:**
1. Download the dataset
2. Read the CSV file with labels
3. Organize images:
   - diagnosis_id 0 → `datasets/train/Normal_Retina/`
   - diagnosis_id 1-4 → `datasets/train/Diabetic_Retinopathy/`
4. Split 80% train, 20% validation

**Sample Python script:**
```python
import pandas as pd
import shutil
from pathlib import Path

df = pd.read_csv('train.csv')
train_images = Path('train_images')
output_train = Path('datasets/train')
output_val = Path('datasets/val')

# Create directories
for split in [output_train, output_val]:
    (split / 'Diabetic_Retinopathy').mkdir(parents=True, exist_ok=True)
    (split / 'Normal_Retina').mkdir(parents=True, exist_ok=True)

# Split and organize
from sklearn.model_selection import train_test_split
train_df, val_df = train_test_split(df, test_size=0.2, random_state=42)

for idx, row in train_df.iterrows():
    src = train_images / f"{row['id_code']}.png"
    if row['diagnosis'] == 0:
        dst = output_train / 'Normal_Retina' / f"{row['id_code']}.png"
    else:
        dst = output_train / 'Diabetic_Retinopathy' / f"{row['id_code']}.png"
    shutil.copy(src, dst)
```

### 3. Melanoma (Skin Lesions)

**Kaggle - SIIM-ISIC Melanoma Classification**
- URL: https://www.kaggle.com/c/siim-isic-melanoma-classification
- Size: ~33,126 training images
- Classes: benign (0), malignant (1)
- Format: JPEG

**Alternative: HAM10000**
- URL: https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000
- Size: ~10,015 images
- Multiple lesion types available

**How to use:**
1. Download the dataset
2. Read the CSV with labels
3. Organize:
   - target = 1 → `datasets/train/Melanoma/`
   - target = 0 → `datasets/train/Benign_Skin/`
4. Split 80/20 for train/validation

### 4. Brain Tumor (MRI)

**Kaggle - Brain Tumor MRI Dataset**
- URL: https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset
- Size: ~7,023 images
- Classes: glioma, meningioma, notumor, pituitary
- Format: JPG

**Alternative: Brain Tumor Classification (MRI)**
- URL: https://www.kaggle.com/datasets/sartajbhuvaji/brain-tumor-classification-mri
- Size: ~3,264 images

**How to use:**
1. Download the dataset
2. Organize images:
   - `glioma/*`, `meningioma/*`, `pituitary/*` → `datasets/train/Brain_Tumor/`
   - `notumor/*` → `datasets/train/Normal_Brain/`
3. Split 80/20 for train/validation

## Directory Structure

After organizing, your dataset should look like this:

```
datasets/
├── train/
│   ├── Pneumonia/              # 3000+ images
│   ├── Normal_Chest/           # 3000+ images
│   ├── Diabetic_Retinopathy/   # 2000+ images
│   ├── Normal_Retina/          # 2000+ images
│   ├── Melanoma/               # 2000+ images
│   ├── Benign_Skin/            # 2000+ images
│   ├── Brain_Tumor/            # 2000+ images
│   └── Normal_Brain/           # 2000+ images
└── val/
    ├── Pneumonia/              # 750+ images
    ├── Normal_Chest/           # 750+ images
    ├── Diabetic_Retinopathy/   # 500+ images
    ├── Normal_Retina/          # 500+ images
    ├── Melanoma/               # 500+ images
    ├── Benign_Skin/            # 500+ images
    ├── Brain_Tumor/            # 500+ images
    └── Normal_Brain/           # 500+ images
```

## Data Quality Guidelines

### Image Requirements
- **Format**: JPG, JPEG, or PNG
- **Size**: Any size (will be resized to 224x224)
- **Quality**: Clear, non-blurry images
- **Consistency**: Similar imaging conditions per class

### Quantity Guidelines
- **Minimum per class**: 1,000 images
- **Recommended per class**: 2,000-5,000 images
- **Validation split**: 20% of total data

### Class Balance
- Try to have similar numbers of images per class
- If imbalanced, consider:
  - Data augmentation for minority classes
  - Class weights during training
  - Oversampling minority classes

## Data Cleaning Steps

1. **Remove duplicates**:
```bash
fdupes -rdN datasets/
```

2. **Verify image integrity**:
```python
from PIL import Image
import os

def verify_images(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                try:
                    img = Image.open(os.path.join(root, file))
                    img.verify()
                except Exception as e:
                    print(f"Corrupted: {os.path.join(root, file)}")
                    os.remove(os.path.join(root, file))

verify_images('datasets/train')
verify_images('datasets/val')
```

3. **Check class distribution**:
```python
import os

for split in ['train', 'val']:
    print(f"\n{split.upper()} set:")
    for class_name in os.listdir(f'datasets/{split}'):
        class_path = f'datasets/{split}/{class_name}'
        if os.path.isdir(class_path):
            count = len([f for f in os.listdir(class_path)
                        if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
            print(f"  {class_name}: {count} images")
```

## Data Augmentation

The training script automatically applies:
- Rotation: ±30°
- Width/Height shifts: 20%
- Shear: 20%
- Zoom: 20%
- Horizontal flip
- Brightness: 80-120%

No manual augmentation needed!

## Alternative Data Sources

### Medical Image Databases
1. **CheXpert**: https://stanfordmlgroup.github.io/competitions/chexpert/
2. **NIH Chest X-rays**: https://www.nih.gov/news-events/news-releases/nih-clinical-center-provides-one-largest-publicly-available-chest-x-ray-datasets-scientific-community
3. **ISIC Archive**: https://www.isic-archive.com/
4. **Cancer Imaging Archive**: https://www.cancerimagingarchive.net/

### Important Notes
- Check dataset licenses before use
- Some datasets require registration
- Respect data usage agreements
- Consider patient privacy (most public datasets are anonymized)

## Quick Start Script

Create `organize_datasets.py`:

```python
#!/usr/bin/env python3
import os
from pathlib import Path

# Create directory structure
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
        path = base_path / split / class_name
        path.mkdir(parents=True, exist_ok=True)
        print(f"Created: {path}")

print("\nDataset structure created!")
print("Now copy your images to the appropriate folders.")
```

Run with:
```bash
python organize_datasets.py
```

## Validation Before Training

Before starting training, verify:

1. ✅ All 8 class folders exist in train/ and val/
2. ✅ Each class has at least 1000 images
3. ✅ Train/val split is approximately 80/20
4. ✅ Images open correctly (no corruption)
5. ✅ Classes are balanced (similar counts)
6. ✅ No duplicate images
7. ✅ Sufficient disk space (~10-50 GB)

## Troubleshooting

**Issue**: Not enough disk space
- Solution: Use external hard drive or cloud storage

**Issue**: Download too slow
- Solution: Use Kaggle API for faster downloads

**Issue**: Images in wrong format
- Solution: Convert with ImageMagick or Pillow

**Issue**: Class imbalance
- Solution: Augment minority classes or use class weights

**Issue**: Corrupted images
- Solution: Run verification script and remove bad files

## Next Steps

Once datasets are organized:

1. Verify structure matches expected layout
2. Run image count script to check distribution
3. Start training with: `python train_model.py datasets/train datasets/val`
4. Monitor training progress
5. Evaluate model performance

For more help, see the main README.md file.
