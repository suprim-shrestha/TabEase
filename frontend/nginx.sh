#!/bin/bash

sudo rm -rf src/dist
sudo docker run --rm -v "$(pwd)":/app -w /app node:18-alpine sh -c "npm install && npm run build"
sudo rm -rf /var/www/tabease/*
sudo cp -r src/dist/* /var/www/tabease/
