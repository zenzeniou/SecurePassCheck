FROM python:3.12-slim-bookworm

WORKDIR /app

# Install system dependencies needed for Python packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev build-essential && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set the working directory to Backend
WORKDIR /app/Backend

# Expose the port your app runs on
EXPOSE 5050

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Run the application
CMD ["python", "app.py"]