# Deployment Configuration Files

## Backend Deployment (Railway/Render)

### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health"
  }
}
```

### Dockerfile (Alternative)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## Frontend Deployment (Vercel)

### vercel.json
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Database Options

### 1. PlanetScale (Recommended - Free tier)
- Serverless MySQL
- Automatic scaling
- Built-in branching

### 2. Railway PostgreSQL
- Integrated with Railway
- Easy setup
- Good for small apps

### 3. AWS RDS
- Production-grade
- More configuration required
- Higher cost

## Deployment Steps

### Step 1: Backend Deployment
1. Create Railway account
2. Connect GitHub repository
3. Set environment variables
4. Deploy automatically

### Step 2: Database Setup
1. Create PlanetScale database
2. Run migration scripts
3. Seed with initial data

### Step 3: Frontend Deployment
1. Create Vercel account
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `dist`

### Step 4: Domain Configuration
1. Purchase domain (Namecheap/GoDaddy)
2. Configure DNS settings
3. Set up SSL certificates

## Environment Variables Needed

### Backend (.env)
- DATABASE_URL
- JWT_SECRET
- CLOUDINARY_*
- FRONTEND_URL

### Frontend (.env)
- VITE_API_URL
- VITE_APP_NAME

## Post-Deployment Checklist
- [ ] Backend health check working
- [ ] Database connected
- [ ] Frontend loads correctly
- [ ] API calls working
- [ ] File uploads functional
- [ ] Authentication working
- [ ] Admin panel accessible
