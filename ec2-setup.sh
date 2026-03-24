#!/bin/bash
# Run this once on your EC2 instance (Amazon Linux 2 / Ubuntu)

# Install Docker
sudo apt-get update -y
sudo apt-get install -y docker.io docker-compose git

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Allow ubuntu user to run docker without sudo
sudo usermod -aG docker ubuntu

echo "Docker setup complete. Re-login for group changes to take effect."
