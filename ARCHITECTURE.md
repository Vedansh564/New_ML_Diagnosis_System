# System Architecture

This document describes the technical architecture of the AI Medical Diagnosis System.

## Overview

The system follows a modern full-stack architecture with clear separation between frontend, backend, and data layers.

```
┌─────────────────────────────────────────────────────────────┐
│                       User Interface                         │
│  (React + TypeScript + Tailwind CSS + Vite)                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                             │
│  (FastAPI + Python + TensorFlow + OpenCV)                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SQL Queries
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Database Layer                           │
│  (Supabase/PostgreSQL)                                      │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Technology Stack

- **React 18**: UI component framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Supabase Client**: Database connectivity

### Component Structure

```
src/
├── App.tsx                    # Main application component
├── main.tsx                   # Entry point
├── components/
│   ├── ImageUpload.tsx        # File upload with drag-and-drop
│   ├── ResultsDisplay.tsx     # Prediction results visualization
│   ├── HistoryView.tsx        # Predictions history table
│   └── Statistics.tsx         # Analytics dashboard
└── lib/
    └── supabase.ts           # Supabase client configuration
```

### Component Responsibilities

#### App.tsx
- Main application container
- Tab navigation (Upload, History, Statistics)
- State management for predictions
- API communication with backend
- Error handling and loading states

#### ImageUpload.tsx
- Drag-and-drop interface
- File validation (image types only)
- Image preview
- Upload progress indication

#### ResultsDisplay.tsx
- Prediction results visualization
- Confidence score display
- Disease type and severity information
- Top 5 predictions list
- Grad-CAM heatmap display
- Disclaimer notice

#### HistoryView.tsx
- Real-time prediction history from Supabase
- Sortable and filterable list
- Timestamp formatting
- Normal/Abnormal badges

#### Statistics.tsx
- Total predictions count
- Normal vs abnormal distribution
- Disease type breakdown
- Average confidence score
- Visual charts and graphs

### State Management

- Uses React hooks (useState, useEffect)
- Local component state for UI interactions
- API responses stored in state
- Real-time updates via Supabase subscriptions (future enhancement)

### API Communication

```typescript
// Example API call
const response = await fetch(`${apiUrl}/predict`, {
  method: 'POST',
  body: formData,
});
const data = await response.json();
```

## Backend Architecture

### Technology Stack

- **FastAPI**: Modern Python web framework
- **TensorFlow 2.15**: Deep learning framework
- **EfficientNetB3**: Pre-trained CNN model
- **OpenCV**: Image processing
- **Pillow**: Image manipulation
- **NumPy**: Numerical computing
- **scikit-learn**: ML utilities
- **Supabase Client**: Database connectivity

### Module Structure

```
backend/
├── app.py                # FastAPI application & routes
├── config.py             # Configuration settings
├── predictor.py          # Prediction engine
├── gradcam.py           # Grad-CAM visualization
├── train_model.py       # Model training script
└── requirements.txt     # Python dependencies
```

### Module Responsibilities

#### app.py (FastAPI Application)
- REST API endpoints
- Request validation
- File upload handling
- Response formatting
- CORS middleware
- Error handling
- Supabase integration

**Endpoints:**
- `GET /` - API information
- `GET /health` - Health check
- `POST /predict` - Image prediction
- `GET /predictions` - History retrieval
- `GET /stats` - Statistics aggregation
- `GET /diseases` - Disease information

#### config.py (Configuration)
- Environment variables
- Model parameters
- Disease class definitions
- Severity mappings
- Image preprocessing settings

#### predictor.py (Prediction Engine)
- Model loading and caching
- Image preprocessing pipeline
- Inference execution
- Confidence scoring
- Top-K predictions
- Severity estimation
- Grad-CAM integration

#### gradcam.py (Visual Explanations)
- Gradient computation
- Feature map activation
- Heatmap generation
- Image overlay
- Colormap application

#### train_model.py (Training Script)
- Dataset loading
- Data augmentation
- Model architecture creation
- Transfer learning setup
- Training loop execution
- Validation and metrics
- Model checkpointing
- Performance visualization

### Model Architecture

```
Input (224x224x3)
    ↓
EfficientNetB3 (ImageNet weights)
    ↓
GlobalAveragePooling2D
    ↓
Dense(512, relu) + Dropout(0.5)
    ↓
Dense(256, relu) + Dropout(0.3)
    ↓
Dense(8, softmax)
    ↓
Output (8 classes)
```

**Classes:**
1. Pneumonia
2. Normal_Chest
3. Diabetic_Retinopathy
4. Normal_Retina
5. Melanoma
6. Benign_Skin
7. Brain_Tumor
8. Normal_Brain

### Training Pipeline

```
Dataset Loading
    ↓
Data Augmentation
    ├── Rotation (±30°)
    ├── Shifts (20%)
    ├── Zoom (20%)
    ├── Flip (horizontal)
    └── Brightness (80-120%)
    ↓
Phase 1: Frozen Base Training (20 epochs)
    ↓
Phase 2: Fine-tuning (30 epochs)
    ↓
Model Evaluation
    ├── Accuracy
    ├── Precision
    ├── Recall
    ├── F1-Score
    └── Confusion Matrix
    ↓
Best Model Saved
```

### Prediction Pipeline

```
Image Upload
    ↓
File Validation
    ↓
Image Preprocessing
    ├── Resize to 224x224
    ├── Normalize (0-1)
    └── Batch dimension
    ↓
Model Inference
    ├── Forward pass
    └── Softmax probabilities
    ↓
Post-processing
    ├── Class prediction
    ├── Confidence score
    ├── Top-K predictions
    └── Severity estimation
    ↓
Grad-CAM Generation
    ├── Gradient computation
    ├── Heatmap creation
    └── Image overlay
    ↓
Database Storage
    ↓
JSON Response
```

## Database Architecture

### Technology

- **Supabase**: Managed PostgreSQL
- **PostgreSQL**: Relational database
- **Row Level Security**: Access control

### Schema

#### predictions Table

```sql
CREATE TABLE predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  predicted_class text NOT NULL,
  confidence float NOT NULL,
  disease_type text NOT NULL,
  severity text,
  is_normal boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

**Indexes:**
- `idx_predictions_created_at` on `created_at DESC`
- `idx_predictions_disease_type` on `disease_type`
- `idx_predictions_is_normal` on `is_normal`

**RLS Policies:**
- Public insert (for demo; restrict in production)
- Public read (for demo; restrict in production)

### Data Flow

1. Prediction made in backend
2. Results stored in Supabase
3. Frontend queries history
4. Real-time updates (optional)

## Security Architecture

### Frontend Security

- Environment variables for sensitive config
- Input validation on file uploads
- HTTPS in production
- Content Security Policy headers

### Backend Security

- CORS configuration
- File type validation
- File size limits
- Error message sanitization
- Environment-based configuration
- Rate limiting (future enhancement)

### Database Security

- Row Level Security (RLS) enabled
- Policies for access control
- Parameterized queries
- Connection string encryption
- API key rotation support

### Model Security

- Model file integrity checks
- Secure model loading
- Input sanitization
- Output validation
- No model exposure to clients

## Scalability Considerations

### Current Architecture
- Single server deployment
- Synchronous request handling
- In-memory model loading

### Scaling Strategies

**Horizontal Scaling:**
- Multiple backend instances
- Load balancer (nginx, HAProxy)
- Shared model storage (S3, Cloud Storage)
- Redis for caching
- Message queue for async predictions

**Vertical Scaling:**
- GPU acceleration
- Larger instance sizes
- Model optimization (quantization, pruning)
- Batch prediction support

**Database Scaling:**
- Connection pooling
- Read replicas
- Caching layer (Redis)
- Archival of old predictions

## Performance Optimization

### Frontend Optimizations

- Code splitting
- Lazy loading components
- Image compression before upload
- Debounced API calls
- Memoized components
- Optimized re-renders

### Backend Optimizations

- Model loaded once at startup
- Image preprocessing optimization
- Response compression
- Connection pooling
- Async request handling
- Caching frequent queries

### Model Optimizations

- TensorFlow Lite (mobile deployment)
- Model quantization (INT8)
- Batch inference
- GPU acceleration
- ONNX runtime (faster inference)

## Monitoring and Logging

### Current Logging

- FastAPI automatic request logging
- Python logging module
- Console output
- Error stack traces

### Production Monitoring (Recommended)

**Application Monitoring:**
- APM tools (New Relic, DataDog)
- Error tracking (Sentry)
- Performance metrics
- Uptime monitoring

**Model Monitoring:**
- Prediction distribution
- Confidence scores over time
- Model drift detection
- Performance degradation alerts

**Infrastructure Monitoring:**
- Server metrics (CPU, RAM, Disk)
- Database performance
- API response times
- Error rates

## Deployment Architecture

### Development

```
Local Machine
├── Frontend (localhost:5173)
├── Backend (localhost:8000)
└── Database (Supabase Cloud)
```

### Production (Recommended)

```
┌─────────────────────────────────────┐
│         CDN (Cloudflare)            │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│    Frontend (Vercel/Netlify)        │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│   Load Balancer (Optional)          │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│   Backend (Railway/Render/AWS)      │
│   ├── API Server                    │
│   └── ML Model                      │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│   Database (Supabase)               │
└─────────────────────────────────────┘
```

## Technology Choices Rationale

### Why React?
- Component-based architecture
- Large ecosystem
- TypeScript support
- Fast development
- Wide adoption

### Why FastAPI?
- Modern Python framework
- Automatic API documentation
- Type hints support
- High performance
- Easy async support

### Why EfficientNet?
- State-of-the-art accuracy
- Efficient architecture
- Good transfer learning results
- Reasonable inference speed
- Pre-trained on ImageNet

### Why Supabase?
- Managed PostgreSQL
- Real-time capabilities
- Built-in authentication
- Row Level Security
- Easy to use

### Why Grad-CAM?
- Model interpretability
- Visual explanations
- Trust building
- Debugging tool
- Research validation

## Future Enhancements

### Short-term
- User authentication
- Private predictions
- PDF report generation
- Mobile responsive design
- More disease types

### Medium-term
- Ensemble models
- Multi-language support
- DICOM format support
- Real-time collaboration
- Advanced analytics

### Long-term
- Mobile applications
- Edge deployment
- Federated learning
- Clinical trial integration
- Regulatory compliance

## Development Guidelines

### Code Style
- Python: PEP 8
- TypeScript: ESLint + Prettier
- Comments for complex logic
- Type hints everywhere
- Meaningful variable names

### Testing Strategy
- Unit tests for utilities
- Integration tests for API
- E2E tests for critical flows
- Model performance tests
- Load testing for production

### Version Control
- Git for version control
- Semantic versioning
- Feature branches
- Pull request reviews
- CI/CD pipelines

### Documentation
- README for overview
- API documentation (auto-generated)
- Code comments for complex logic
- Architecture documentation
- Deployment guides

---

This architecture balances simplicity, performance, and scalability while maintaining code quality and maintainability.
