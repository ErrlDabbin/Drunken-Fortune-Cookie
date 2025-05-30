require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { getRandomFortune } = require('./fortunes');
const { Storage } = require('./storage');
const { 
  isFrameRequest, 
  getBaseUrl, 
  createFrameMetadata,
  generateFrameHtml
} = require('./farcaster-integration');

// Initialize storage
const storage = new Storage();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Helper function to generate image URL dynamically based on the deployment
function getFortuneImage(req) {
  const baseUrl = getBaseUrl(req);
  return `${baseUrl}/assets/fortune-cookie.png`;
}

// API Routes



// Get fortune status
app.get('/api/fortune/status', (req, res) => {
  const userId = req.query.userId;
  
  if (!userId) {
    return res.status(400).json({ message: "Missing userId parameter" });
  }
  
  try {
    // Check if the user can get a fortune today
    const canGetFortune = storage.canUserGetFortune(userId);
    
    // Get the user's most recent fortune if they can't get a new one
    let currentFortune = null;
    if (!canGetFortune) {
      const userFortune = storage.getUserFortune(userId);
      if (userFortune) {
        currentFortune = userFortune.fortuneText;
      }
    }
    
    // Get user data for last fortune time
    const user = storage.getUser(userId);
    const lastFortuneAt = user?.lastFortuneAt ? new Date(user.lastFortuneAt).getTime() : null;
    
    return res.json({
      canGetFortune,
      currentFortune,
      lastFortuneAt
    });
  } catch (error) {
    console.error("Error checking fortune status:", error);
    return res.status(500).json({ message: "Failed to check fortune status" });
  }
});

// Get a new fortune
app.post('/api/fortune/new', (req, res) => {
  try {
    console.log("Received request:", JSON.stringify(req.body, null, 2));
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    
    // Check if request is from Farcaster Frame
    if (isFrameRequest(req)) {
      // Handle Farcaster frame request
      // Use a random ID since we don't require user tracking
      const userId = `farcaster_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Get a random fortune for this user
      const fortuneText = getRandomFortune();
      
      // Save the fortune in the background
      storage.createUserFortune({
        userId,
        fortuneText
      });
      
      console.log("Returning Farcaster frame response with fortune:", fortuneText);
      
      // Return response in the exact format required by Farcaster using our utility
      return res.status(200).json(createFrameMetadata(req, {
        image: getFortuneImage(req),
        fortuneText: fortuneText,
        buttonText: "Get Another Fortune"
      }));
    } else {
      // Regular web request
      if (!req.body.userId) {
        return res.status(400).json({ message: "Missing userId parameter" });
      }
      
      const userId = req.body.userId;
      
      // Check if the user can get a fortune today
      const canGetFortune = storage.canUserGetFortune(userId);
      
      if (!canGetFortune) {
        return res.status(403).json({ 
          message: "You've already received your fortune today. Come back tomorrow!" 
        });
      }
      
      // Generate a random fortune (non-repeating for this user)
      const fortuneText = getRandomFortune();
      
      // Save the user's fortune
      const userFortune = storage.createUserFortune({
        userId,
        fortuneText
      });
      
      return res.json({
        fortune: userFortune.fortuneText,
        timestamp: userFortune.createdAt
      });
    }
  } catch (error) {
    console.error("Error generating fortune:", error);
    return res.status(500).json({ message: "Failed to generate fortune" });
  }
});

// Serve the Farcaster manifest
app.get('/.well-known/warpcast.json', (req, res) => {
  const baseUrl = getBaseUrl(req);
  res.json({
    name: "Drunk Fortune Cookie",
    description: "Get your daily drunk fortune cookie with a wobbling, humorous prediction.",
    image: `${baseUrl}/assets/fortune-cookie.png`,
    external_url: baseUrl
  });
});

// Also serve it at an alternate location for testing
app.get('/warpcast.json', (req, res) => {
  const baseUrl = getBaseUrl(req);
  res.json({
    name: "Drunk Fortune Cookie",
    description: "Get your daily drunk fortune cookie with a wobbling, humorous prediction.",
    image: `${baseUrl}/assets/fortune-cookie.png`,
    external_url: baseUrl
  });
});

// Frame HTML endpoints
app.get('/frame', (req, res) => {
  res.send(generateFrameHtml(req, {
    title: 'Drunk Fortune Cookie',
    description: 'Get your daily humorous drunk fortune with a wobbling text effect',
    imageUrl: `${getBaseUrl(req)}/assets/fortune-cookie.png`,
    postUrl: `${getBaseUrl(req)}/api/fortune/new`,
    buttonText: 'Get My Fortune'
  }));
});

// Minimal frame for testing
app.get('/minimal-frame', (req, res) => {
  res.send(generateFrameHtml(req, {
    title: 'Drunk Fortune Cookie (Minimal)',
    description: 'Simple test frame for Farcaster',
    imageUrl: `${getBaseUrl(req)}/assets/fortune-cookie.png`,
    postUrl: `${getBaseUrl(req)}/api/fortune/new`,
    buttonText: 'Break Cookie',
    aspectRatio: '1.91:1'
  }));
});

// Serve index.html for the root path 
app.get('/', (req, res) => {
  const baseUrl = getBaseUrl(req);
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Drunk Fortune Cookie</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background-color: #2F2013;
      color: #f5e6c9;
      margin: 0;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    h1 {
      color: #DAA520;
    }
    .card {
      background-color: #3B271A;
      border-radius: 8px;
      padding: 25px;
      margin: 20px 0;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }
    .cookie-image {
      max-width: 200px;
      margin: 20px 0;
    }
    a {
      color: #DAA520;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .link-box {
      background-color: #251811;
      padding: 15px;
      border-radius: 4px;
      margin: 15px 0;
      text-align: left;
    }
    .farcaster-links {
      list-style: none;
      padding: 0;
      margin: 20px 0;
    }
    .farcaster-links li {
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Drunk Fortune Cookie</h1>
    
    <div class="card">
      <img src="/assets/fortune-cookie.png" alt="Fortune Cookie" class="cookie-image">
      <h2>Daily Inebriated Wisdom</h2>
      <p>Get your hilariously wobbly fortune from our virtual fortune cookie.</p>
      
      <div class="link-box">
        <p><strong>Farcaster Integration:</strong></p>
        <p>Share any of these URLs in Warpcast to use as a Frame:</p>
        <ul class="farcaster-links">
          <li><a href="${baseUrl}/frame">${baseUrl}/frame</a> - Main Frame</li>
          <li><a href="${baseUrl}/minimal-frame">${baseUrl}/minimal-frame</a> - Minimal Test Frame</li>
        </ul>
      </div>
    </div>
    
    <p>Made with 🍻 for Farcaster</p>
  </div>
</body>
</html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});