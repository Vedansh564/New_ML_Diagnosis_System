#!/bin/bash

echo "Starting Medical Diagnosis API Server..."
echo "========================================"

if [ ! -d "venv" ]; then
    echo "Error: Virtual environment not found!"
    echo "Please run: python -m venv venv"
    exit 1
fi

if [ ! -f ".env" ]; then
    echo "Warning: .env file not found!"
    echo "Copying .env.example to .env..."
    cp .env.example .env
    echo "Please update .env with your credentials"
fi

if [ ! -f "models/unified_disease_model.h5" ]; then
    echo "Error: Model not found!"
    echo "Please train the model first:"
    echo "  python train_model.py ../datasets/train ../datasets/val"
    exit 1
fi

source venv/bin/activate

echo "Installing/updating dependencies..."
pip install -q -r requirements.txt

echo ""
echo "Starting FastAPI server on http://localhost:8000"
echo "API docs available at http://localhost:8000/docs"
echo "Press Ctrl+C to stop the server"
echo ""

python app.py
