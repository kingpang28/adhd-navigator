# ADHD Navigator - Deployment Guide for Vercel

This guide will help you deploy the ADHD Pre-Referral Navigator to Vercel.

## Prerequisites

1. **GitHub Account** (free at github.com)
2. **Vercel Account** (free at vercel.com)
3. **Node.js 18+** installed locally (for testing)

## Step 1: Export Code to GitHub

### Option A: Using GitHub CLI (Recommended)
```bash
# Install GitHub CLI if you haven't already
# Then authenticate
gh auth login

# Create a new repository
gh repo create adhd-navigator --public --source=. --remote=origin --push
```

### Option B: Manual GitHub Upload
1. Go to github.com and create a new repository named `adhd-navigator`
2. Clone it locally
3. Copy all files from this project into that directory
4. Run:
```bash
git add .
git commit -m "Initial commit: ADHD Navigator app"
git push origin main
```

## Step 2: Set Up Environment Variables

Before deploying, you need to configure these environment variables in Vercel:

### Required for Authentication:
- `VITE_APP_ID` - Your OAuth application ID
- `OAUTH_SERVER_URL` - OAuth provider URL
- `VITE_OAUTH_PORTAL_URL` - OAuth portal URL
- `JWT_SECRET` - Session signing secret

### Required for Database:
- `DATABASE_URL` - MySQL/TiDB connection string (format: `mysql://user:password@host:port/database`)

### Optional (for AI/LLM features):
- `BUILT_IN_FORGE_API_URL` - API endpoint
- `BUILT_IN_FORGE_API_KEY` - API key
- `VITE_FRONTEND_FORGE_API_URL` - Frontend API URL
- `VITE_FRONTEND_FORGE_API_KEY` - Frontend API key

### App Configuration:
- `VITE_APP_TITLE` - "ADHD Navigator"
- `VITE_APP_LOGO` - Logo URL
- `OWNER_NAME` - Your name
- `OWNER_OPEN_ID` - Your unique ID

## Step 3: Deploy to Vercel

1. Go to **vercel.com** and sign in with GitHub
2. Click **"Add New Project"**
3. Select your `adhd-navigator` repository
4. Vercel will auto-detect it's a Node.js app
5. In **Environment Variables**, add all the variables from Step 2
6. Click **"Deploy"**

Vercel will automatically:
- Install dependencies
- Build the project
- Deploy to a live URL

## Step 4: Configure Database

Your app uses MySQL. You have several options:

### Option A: Managed Database (Recommended)
- **PlanetScale** (free tier available) - MySQL-compatible
- **Supabase** - PostgreSQL (requires code changes)
- **AWS RDS** - Full MySQL support

### Option B: Self-Hosted
- DigitalOcean Managed Database
- Your own VPS with MySQL installed

### Getting a DATABASE_URL:
For PlanetScale:
```
mysql://username:password@aws.connect.psdb.cloud/adhd_navigator?sslaccept=strict
```

## Step 5: Verify Deployment

After deployment:
1. Visit your Vercel URL
2. Test the screening questionnaire
3. Test vitals recording
4. Verify clinic comparison loads
5. Check that data persists (sign in, add data, refresh page)

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Ensure DATABASE_URL is correct
- Check Node.js version compatibility (18+)

### Database Connection Error
- Verify DATABASE_URL format
- Check database user permissions
- Ensure database is accessible from Vercel's IP

### Authentication Issues
- Verify OAuth credentials are correct
- Check JWT_SECRET is set
- Ensure VITE_APP_ID matches your OAuth provider

### Data Not Persisting
- Verify DATABASE_URL is correct
- Check database migrations ran: `pnpm db:push`
- Verify user is authenticated

## Local Development (Before Deploying)

To test locally:

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run database migrations
pnpm db:push

# Start dev server
pnpm dev

# Run tests
pnpm test
```

## Production Considerations

1. **Security**
   - Use strong JWT_SECRET
   - Enable HTTPS (Vercel does this by default)
   - Regularly rotate API keys

2. **Performance**
   - Database queries are optimized
   - Frontend is pre-built and cached
   - Consider adding CDN for static assets

3. **Monitoring**
   - Check Vercel Analytics dashboard
   - Monitor database query performance
   - Set up error tracking (Sentry, etc.)

## Support

For issues:
1. Check Vercel deployment logs
2. Review database connection
3. Verify environment variables
4. Check browser console for errors

## Next Steps

After successful deployment:
1. Add custom domain (Vercel settings)
2. Set up analytics
3. Configure email notifications
4. Add backup strategy for database
