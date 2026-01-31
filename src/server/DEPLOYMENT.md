# Price Checker Server - Docker Deployment

## Quick Start

### Local Development
```bash
cd src/server
npm run dev
```

### Build and Test Locally
```bash
cd src/server
npm run build
npm start
```

### Docker Deployment

#### 1. Prerequisites
- Docker and Docker Compose installed
- `.env` file configured in `src/server/`

#### 2. Build and Run
```bash
# From project root
docker-compose up -d

# Or rebuild
docker-compose up --build -d
```

#### 3. Check Status
```bash
# View logs
docker-compose logs -f price-checker-server

# Check health
curl http://localhost:3002/health
```

#### 4. Stop
```bash
docker-compose down
```

## Configuration

### Environment Variables
Create `src/server/.env` with:

```env
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
PORT=3002
SANDBOX_MODE=false
```

### Volumes
The following directories are persisted:
- `userData/` - Production data
- `userData-sandbox/` - Sandbox/test data
- `logs/` - Application logs (inside container)

## Production Deployment

### Deploy to Home Server
```bash
# SSH to your server
ssh your-server

# Clone/pull the repo
cd /path/to/price-checker

# Configure .env
nano src/server/.env

# Build and start
docker-compose up -d

# Monitor
docker-compose logs -f
```

### PM2 Management
Inside the container, PM2 manages the process:
- Auto-restart on crashes
- Memory limit: 1GB
- Log rotation
- Max 50 restarts

### Health Check
Docker automatically monitors the `/health` endpoint every 30s.

## Troubleshooting

### View Logs
```bash
docker-compose logs -f price-checker-server
```

### Restart Service
```bash
docker-compose restart price-checker-server
```

### Rebuild After Code Changes
```bash
docker-compose up --build -d
```

### Access Container Shell
```bash
docker exec -it price-checker-server sh
```

### Check PM2 Status (inside container)
```bash
docker exec -it price-checker-server npx pm2 list
```
