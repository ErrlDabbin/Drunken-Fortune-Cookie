# Deploying Your Drunk Fortune Cookie App

This guide will help you deploy your Drunk Fortune Cookie app to Vercel, which is known to work well with Farcaster Frames.

## Prerequisites

- A GitHub account
- A Vercel account (free tier is fine)
- Basic familiarity with Git

## Step 1: Fork the Repository

1. Fork this repository to your GitHub account
2. Clone the forked repository to your local machine:
   ```
   git clone https://github.com/your-username/drunk-fortune-cookie.git
   cd drunk-fortune-cookie
   ```

## Step 2: Update URLs

Before deploying, you need to update all the URLs in the codebase to match your actual deployment URL.

1. Once you deploy to Vercel, you'll get a URL like `https://your-app-name.vercel.app`
2. Search for and replace all instances of `https://your-deployment-url.com` with your actual Vercel URL
3. The main files to update are:
   - `public/index.html`
   - `public/minimal-frame.html`
   - `public/farcaster-card.html`
   - `public/.well-known/warpcast.json`

## Step 3: Deploy to Vercel

1. Sign up or log in to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Keep all default settings (Vercel will detect this as a Node.js project)
5. Add the following environment variables:
   - `BASE_URL`: Set this to your Vercel deployment URL (e.g., `https://your-app-name.vercel.app`)
6. Click "Deploy"

## Step 4: Test Your Frame

1. After deployment, visit `https://your-app-name.vercel.app/frame-debug.html`
2. Use the debugging tools to verify your meta tags and test the API response
3. Share your URL on Warpcast to test the Frame integration

## Common Issues and Fixes

### Images Not Loading

- Make sure all image URLs are absolute (start with https://)
- Verify that image paths are correct in your code

### Frame Not Working in Warpcast

- Check that the `.well-known/warpcast.json` file is being properly served
- Use the Frame Debugger at `/frame-debug.html` to check for issues

### API Errors

- Check Vercel logs for any server-side errors
- Ensure your host allows CORS if you're testing from other domains

## Customization

To customize your app:

1. Update the fortunes in `fortunes.js`
2. Modify the styling in the HTML files
3. Update the cookie image in `public/assets/fortune-cookie.png`

## Switching to a Database

The app currently uses in-memory storage, which resets when the server restarts. To use a database:

1. Add a database service (e.g., MongoDB, PostgreSQL) to your Vercel project
2. Modify the `storage.js` file to connect to your database
3. Update the storage methods to read/write from the database