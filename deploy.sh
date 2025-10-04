#!/bin/bash
echo "🚀 Deploying AirSense Delhi Platform..."
echo "📦 Installing dependencies..."
pip install -r requirements.txt
echo "🔥 Starting Flask API server..."
python app.py
