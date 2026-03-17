@echo off
echo Starting Medical Diagnosis API Server...
echo ========================================

if not exist "venv" (
    echo Error: Virtual environment not found!
    echo Please run: python -m venv venv
    exit /b 1
)

if not exist ".env" (
    echo Warning: .env file not found!
    echo Copying .env.example to .env...
    copy .env.example .env
    echo Please update .env with your credentials
)

if not exist "models\unified_disease_model.h5" (
    echo Error: Model not found!
    echo Please train the model first:
    echo   python train_model.py ..\datasets\train ..\datasets\val
    exit /b 1
)

call venv\Scripts\activate

echo Installing/updating dependencies...
pip install -q -r requirements.txt

echo.
echo Starting FastAPI server on http://localhost:8000
echo API docs available at http://localhost:8000/docs
echo Press Ctrl+C to stop the server
echo.

python app.py
