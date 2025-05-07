# Drunk Fortune Cookie 🥠

A playful Farcaster mini app that generates humorous "drunk" fortunes with an interactive and engaging user experience. The application creates memorable, shareable moments through creative fortune generation.

## Features

- 🍪 Daily fortune cookie with wobbling "drunk" text effects
- 🌈 Multiple personalized aesthetic themes with different animations
- 🔊 Sound effects with user-controllable volume
- 📱 Mobile-responsive design
- 🔄 24-hour cooldown timer for new fortunes
- 🎮 Interactive animations and confetti effects

## Farcaster Integration

This app integrates with Farcaster as a Frame, allowing users to share and interact with fortunes directly in Warpcast.

### Frame URLs

When deployed, you can use the following URLs for Farcaster Frames:

- `/frame` - Main frame with full styling
- `/minimal-frame` - Minimal test frame

## Deployment

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR-USERNAME%2Fdrunk-fortune-cookie)

### Manual Deployment

1. Clone this repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`

The app will be available at `http://localhost:3000`

### Environment Variables

- `PORT` - Server port (default: 3000)
- `BASE_URL` - Base URL of your deployment (optional, auto-detected if not provided)

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev
```

## License

MIT