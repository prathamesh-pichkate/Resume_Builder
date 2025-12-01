# Docker Setup Guide for Resume Builder

This guide helps you run the Resume Builder application using Docker and Docker Compose.

## Prerequisites

- Docker installed ([get Docker](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)
- `.env.docker` files configured in `server/` and `client/` directories

## Quick Start with Docker Compose

### 1. Prepare Environment Files

Ensure both `.env.docker` files exist with all required variables:

```bash
# Server configuration
server/.env.docker

# Client configuration
client/.env.docker
```

### 2. Start the Application

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode (background)
docker-compose up -d --build
```

### 3. Access the Application

Once containers are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

### 4. View Logs

```bash
# View all container logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f server
docker-compose logs -f client
```

### 5. Stop and Clean Up

```bash
# Stop containers (preserves volumes)
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild after code changes
docker-compose up --build --no-cache
```

## Docker Compose Configuration

The `docker-compose.yml` includes:

- **Server**: Node.js 18 Express API (port 3000)
- **Client**: React + Vite frontend (port 5173)
- **Network**: Shared bridge network for inter-container communication
- **MongoDB**: Connects to MongoDB Atlas (not locally hosted)

## Manual Docker Commands

### Build Images

```bash
# Build server image
cd server
docker build -t resume-builder-server:latest .

# Build client image
cd client
docker build -t resume-builder-client:latest .
```

### Run Containers Individually

```bash
# Run server
docker run -p 3000:3000 --env-file server/.env.docker resume-builder-server:latest

# Run client
docker run -p 5173:5173 --env-file client/.env.docker resume-builder-client:latest
```

## Environment Variables for Docker

### Required Server Variables (`server/.env.docker`)

```bash
PORT=3000
NODE_ENV=production
CLIENT_URL=http://localhost:5173,https://your-domain.com
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/db
JWT_SECRET=your_secret_key
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id/
GEMINI_API_KEY=your_api_key
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
GEMINI_MODEL_NAME=gemini-2.0-flash
```

### Required Client Variables (`client/.env.docker`)

```bash
VITE_BASE_URL=http://localhost:3000
VITE_API_KEY=your_firebase_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_MESSAGING_SENDERID=your_sender_id
VITE_APP_ID=your_app_id
VITE_MEASUREMENT_ID=your_measurement_id
```

## Useful Docker Commands

```bash
# List running containers
docker-compose ps

# Restart a service
docker-compose restart server

# Rebuild a specific service
docker-compose build --no-cache server

# Execute command in running container
docker-compose exec server npm test

# Remove all stopped containers
docker container prune

# View image size
docker images | grep resume-builder
```

## Troubleshooting

### Container won't start

Check logs:

```bash
docker-compose logs server
docker-compose logs client
```

### Port already in use

```bash
# Change port in docker-compose.yml
# Or kill the process using the port:
lsof -i :3000  # Find process using port 3000
kill -9 <PID>
```

### MongoDB Atlas Connection Issues

- Verify `MONGODB_URI` in `server/.env.docker`
- Ensure IP whitelist includes your Docker container
- Check MongoDB Atlas connection string format

### Volume permission issues

```bash
# On Linux, fix volume ownership
sudo chown -R $USER:$USER ./server ./client
```

## Production Deployment with Docker

When deploying to production:

1. Use a `.env.docker` file with production values
2. Set `NODE_ENV=production`
3. Consider using multi-stage builds for optimization
4. Use a container registry (Docker Hub, ECR, etc.)
5. Implement health checks in docker-compose.yml

Example:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
