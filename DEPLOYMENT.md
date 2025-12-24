# Deployment Guide for SwirledOut

This guide covers free deployment options for the SwirledOut boardgame web app.

## Architecture

- **Frontend**: React + Vite (static files after build)
- **Backend**: Node.js + boardgame.io server (needs WebSocket support)
- **WebRTC**: P2P video chat (needs WebSocket for signaling)

## Recommended: Railway (Easiest Full-Stack)

**Free Tier**: $5/month credit (usually enough for small apps)

### Steps:

1. **Sign up**: https://railway.app (use GitHub login)

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your SwirledOut repository

3. **Configure**:
   - Railway auto-detects Node.js
   - Set **Start Command**: `npm run server`
   - Set **Root Directory**: `/` (or leave default)

4. **Environment Variables** (optional):
   - `PORT`: Railway sets this automatically
   - `NODE_ENV=production`

5. **Deploy**:
   - Railway will build and deploy automatically
   - Get your URL: `https://your-app.railway.app`

6. **Update Frontend**:
   - Update `vite.config.ts` proxy target to your Railway URL
   - Or deploy frontend separately (see Vercel option below)

---

## Option 2: Render (Free Tier)

**Free Tier**: Web service (spins down after 15min inactivity, freezes on inactivity)

### Backend Setup:

1. **Sign up**: https://render.com

2. **Create Web Service**:
   - New → Web Service
   - Connect GitHub repo
   - Settings:
     - **Build Command**: `npm install`
     - **Start Command**: `npm run server`
     - **Environment**: Node

3. **Get URL**: `https://your-app.onrender.com`

### Frontend Setup (Separate):

1. **Create Static Site**:
   - New → Static Site
   - Connect same repo
   - Settings:
     - **Build Command**: `npm run build`
     - **Publish Directory**: `dist`

---

## Option 3: Vercel (Frontend) + Railway/Render (Backend)

**Best for**: Maximum performance and free tier limits

### Frontend on Vercel:

1. **Sign up**: https://vercel.com (GitHub login)

2. **Import Project**:
   - New Project → Import from GitHub
   - Select SwirledOut repo

3. **Configure**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**:
   - `VITE_API_URL`: Your backend URL (Railway/Render)

5. **Deploy**: Automatic on every push

### Backend:
- Deploy to Railway or Render (see above)

### Update Frontend Code:

Update `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/socket.io": {
        target: process.env.VITE_API_URL || "http://localhost:8000",
        ws: true,
      },
    },
  },
});
```

For production, update your API calls to use `import.meta.env.VITE_API_URL`.

---

## Option 4: Fly.io

**Free Tier**: 3 shared VMs, 160GB outbound data

1. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`

2. **Login**: `fly auth login`

3. **Initialize**: `fly launch` (in project directory)

4. **Deploy**: `fly deploy`

---

## Important Notes

### WebSocket Support
- ✅ Railway: Full support
- ✅ Render: Full support (on paid tier, limited on free)
- ✅ Fly.io: Full support
- ⚠️ Vercel: Serverless functions don't support persistent WebSockets (use for frontend only)

### Environment Variables

Create `.env.production`:
```env
PORT=8000
NODE_ENV=production
```

### CORS Configuration

If frontend and backend are on different domains, update `src/server/index.ts`:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### Build Optimization

Before deploying:
```bash
npm run build  # Test production build locally
npm run preview  # Test production build
```

---

## Quick Start (Railway - Recommended)

1. Push code to GitHub
2. Go to https://railway.app
3. New Project → Deploy from GitHub
4. Select your repo
5. Set Start Command: `npm run server`
6. Deploy!

Your app will be live at `https://your-app.railway.app`

---

## Troubleshooting

### WebSocket Connection Issues
- Ensure your hosting provider supports WebSockets
- Check firewall/proxy settings
- Verify CORS configuration

### Build Failures
- Check Node.js version (should be 18+)
- Ensure all dependencies are in `package.json`
- Review build logs in deployment dashboard

### Port Issues
- Most platforms set `PORT` automatically
- Don't hardcode port numbers
- Use `process.env.PORT || 8000`

---

## Cost Comparison

| Platform | Free Tier | Best For |
|----------|-----------|----------|
| Railway | $5/month credit | Full-stack apps |
| Render | Free (with limits) | Simple deployments |
| Vercel | Generous free tier | Frontend/static sites |
| Fly.io | 3 VMs free | Global edge deployment |

**Recommendation**: Start with Railway for simplicity, or Vercel (frontend) + Railway (backend) for best performance.


