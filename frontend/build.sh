sudo docker run --rm -v "$(pwd)":/app -w /app node:18-alpine sh -c "npm install && npm run build"

