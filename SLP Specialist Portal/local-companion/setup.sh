#!/bin/bash

# Clinical AI Local Companion Setup Script
echo "Setting up Local Companion dependencies..."

# 1. Create virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install --upgrade pip
pip install fastapi uvicorn langchain langchain-community langchain-text-splitters sentence-transformers chromadb llama-cpp-python requests

echo "Dependencies installed! The model will download automatically upon first launch of main.py."
