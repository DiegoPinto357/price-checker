# Price Checker Server

A standalone Fastify server for the Price Checker application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration values.

## Development

Run the server in development mode with hot reload:
```bash
npm run dev
```

For Android development (binds to 0.0.0.0):
```bash
npm run dev:android
```

## Production

Build the TypeScript code:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `PORT`: Server port (default: 3002)
- `ANDROID`: Set to `true` to bind to 0.0.0.0 instead of localhost
- `SANDBOX_MODE`: Set to `true` to use sandbox databases and storage

## API Endpoints

### Health Check
- `GET /health` - Check server status

### Database
- `POST /database/find` - Find documents
- `POST /database/findOne` - Find a single document
- `POST /database/insert` - Insert multiple documents
- `POST /database/insertOne` - Insert a single document
- `POST /database/updateOne` - Update a document

### Storage
- `POST /storage/write-file` - Write a file to local storage
- `GET /storage/read-file/:filename` - Read a file from local storage

### NF Parser
- `GET /nf-data?key=<qr_code_key>` - Parse Brazilian NF-e (fiscal note)

### YouTube
- `GET /youtube/video-data?videoURL=<url>` - Get video data and transcript

### OpenAI
- `POST /openai/create-response` - Create an AI response
