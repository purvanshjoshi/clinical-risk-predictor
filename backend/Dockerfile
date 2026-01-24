# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
# Install gcc and other build deps because shap/xgboost might need them
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .

# Make port 8001 available to the world outside this container
EXPOSE 8001

# Run api.py when the container launches
CMD ["uvicorn", "backend.api:app", "--host", "0.0.0.0", "--port", "8001"]
