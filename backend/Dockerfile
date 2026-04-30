# Use lightweight Python
FROM python:3.10-slim

# Prevent .pyc files & buffering
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose Django port
EXPOSE 8000

# IMPORTANT FIX: use 0.0.0.0 and no shell chaining issues
CMD ["python", "manage.py", "migrate"] 
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]