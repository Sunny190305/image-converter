# Image Converter

A modern web application for converting images between different formats (JPG, PNG, WEBP, GIF, PDF) with a beautiful UI.

## Features

- 🖼️ Convert images to multiple formats
- 📱 Drag & drop interface
- ⚡ Fast conversion using Sharp library
- 🎨 Modern, premium UI design
- 🌐 Full-stack application with React + Express

## Tech Stack

- **Frontend**: React, Vite, Framer Motion
- **Backend**: Node.js, Express, Sharp, PDFKit
- **Deployment**: Render

## Local Development

### Prerequisites
- Node.js 16+ installed

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Sunny190305/image-converter.git
cd image-converter
```

2. Install dependencies:
```bash
npm install
```

3. Run backend server:
```bash
npm run backend
```

4. Run frontend (in another terminal):
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## Deployment on Render

### Backend Deployment

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

### Frontend Deployment

1. Create a new **Static Site** on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variable**: 
     - Key: `VITE_API_URL`
     - Value: Your backend URL (e.g., `https://your-backend.onrender.com`)

## Environment Variables

### Frontend
- `VITE_API_URL`: Backend API URL (defaults to `http://localhost:3000` for local development)

See `.env.example` for reference.

## License

MIT
