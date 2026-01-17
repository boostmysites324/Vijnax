# Frontend Environment Variables Setup

## Overview
The frontend uses Vite, which requires environment variables to be prefixed with `VITE_` to be exposed to the client-side code.

## Setup Instructions

1. **Create a `.env` file** in the root directory (same level as `package.json`):

```bash
# Frontend Environment Variables
# Copy this content to .env file

# API Configuration
VITE_API_BASE_URL=http://localhost:5001/api
VITE_API_BASE_URL_PROD=https://your-production-api.com/api

# Vite Dev Server Configuration
VITE_PORT=3000
VITE_HOST=0.0.0.0
VITE_API_TARGET=http://localhost:5001

# App Configuration
VITE_APP_NAME=Career Compass
VITE_APP_VERSION=1.0.0

# Environment
VITE_NODE_ENV=development

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

2. **For Production**, create a `.env.production` file:

```bash
# Production Environment Variables
VITE_API_BASE_URL=https://your-production-api.com/api
VITE_NODE_ENV=production
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

3. **For Local Development**, create a `.env.local` file (this overrides `.env`):

```bash
# Local Development Overrides
VITE_API_BASE_URL=http://localhost:5001/api
VITE_API_TARGET=http://localhost:5001
VITE_NODE_ENV=development
```

## Important Notes

- **All environment variables must be prefixed with `VITE_`** to be accessible in client code
- The `.env` file should be in `.gitignore` (already configured)
- Use `import.meta.env.VITE_*` in your code, not `process.env`
- Restart the dev server after changing `.env` files

## Usage in Code

```javascript
// ✅ Correct (Vite way)
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// ❌ Wrong (Node.js way - won't work in Vite)
const apiUrl = process.env.VITE_API_BASE_URL;
```

## Current Configuration

- **API Base URL**: Configured in `src/services/api.js`
- **Proxy Target**: Configured in `vite.config.ts`
- **Port**: Defaults to 3000, can be overridden with `VITE_PORT`

## Quick Start

1. Copy the content above to create `.env` file
2. Update `VITE_API_TARGET` if your backend runs on a different port
3. Restart the dev server: `npm run dev`
