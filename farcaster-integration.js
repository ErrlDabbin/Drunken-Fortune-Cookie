/**
 * Farcaster Integration Helper Functions
 * 
 * This file provides utilities to handle Farcaster Frame integration
 * with dynamic URL detection that works on any deployment platform.
 */

/**
 * Determine if a request is coming from a Farcaster Frame
 * @param {Object} req - Express request object
 * @returns {boolean} - Whether the request is from a Farcaster Frame
 */
function isFrameRequest(req) {
  const ua = req.headers['user-agent'] || '';
  const hasFarcasterHeaders = 
    req.body && (
      req.body.untrustedData || 
      req.body.trustedData ||
      req.body.frameData ||
      req.body.fid
    );
    
  return hasFarcasterHeaders || ua.includes('Warpcast');
}

/**
 * Get the base URL for the current deployment
 * This handles various hosting platforms automatically
 * @param {Object} req - Express request object
 * @returns {string} - The base URL for the current deployment
 */
function getBaseUrl(req) {
  // Priority order for determining the base URL:
  
  // 1. Custom configured BASE_URL from environment
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }

  // 2. Vercel URL environment variables
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // 3. Detected from request headers (works for most platforms including Replit)
  const protocol = process.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = process.headers['x-forwarded-host'] || req.get('host') || 'localhost:3000';
  
  return `${protocol}://${host}`;
}

/**
 * Generate a Frame metadata object for the response 
 * @param {Object} req - Express request object
 * @param {Object} options - Configuration options for the frame
 * @returns {Object} - Frame metadata for the response
 */
function createFrameMetadata(req, options = {}) {
  const baseUrl = getBaseUrl(req);
  
  const defaultOptions = {
    image: `${baseUrl}/assets/fortune-cookie.png`,
    fortuneText: '',
    buttonText: 'Get Another Fortune'
  };
  
  const config = { ...defaultOptions, ...options };
  
  return {
    image: config.image,
    text: config.fortuneText ? 
      `🥠 Your drunk fortune says:\n\n"${config.fortuneText}"\n\n` :
      `Break the cookie to receive your fortune!`,
    buttons: [
      {
        label: config.buttonText
      }
    ]
  };
}

/**
 * Generate the HTML for a Frame
 * @param {Object} req - Express request object 
 * @param {Object} options - Configuration options for the frame
 * @returns {string} - HTML string for the frame
 */
function generateFrameHtml(req, options = {}) {
  const baseUrl = getBaseUrl(req);
  
  const defaultOptions = {
    title: 'Drunk Fortune Cookie',
    description: 'Get your daily humorous drunk fortune',
    imageUrl: `${baseUrl}/assets/fortune-cookie.png`,
    postUrl: `${baseUrl}/api/fortune/new`,
    buttonText: 'Get My Fortune',
    aspectRatio: '1:1',
    bgColor: '#2F2013',
    textColor: '#f5e6c9',
    accentColor: '#DAA520'
  };
  
  const config = { ...defaultOptions, ...options };
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.title}</title>
  
  <!-- Farcaster Frame Meta Tags -->
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:init" content="true" />
  <meta property="fc:frame:image" content="${config.imageUrl}" />
  <meta property="fc:frame:button:1" content="${config.buttonText}" />
  <meta property="fc:frame:post_url" content="${config.postUrl}" />
  <meta property="fc:frame:aspect_ratio" content="${config.aspectRatio}" />
  
  <!-- OpenGraph Tags -->
  <meta property="og:title" content="${config.title}" />
  <meta property="og:description" content="${config.description}" />
  <meta property="og:image" content="${config.imageUrl}" />
</head>
<body style="font-family: system-ui, sans-serif; margin: 0; padding: 20px; background-color: ${config.bgColor}; color: ${config.textColor}; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center;">
  <div style="max-width: 600px; margin: 0 auto;">
    <h1 style="margin-bottom: 20px; color: ${config.accentColor};">${config.title}</h1>
    <div style="background-color: #3B271A; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
      <img src="${config.imageUrl}" alt="Fortune Cookie" style="max-width: 150px; margin-bottom: 15px;">
      <p style="margin-bottom: 20px;">${config.description}</p>
      <div style="background-color: #251811; border-radius: 4px; padding: 15px; font-family: monospace; text-align: left; margin-bottom: 20px;">
        <p style="color: ${config.textColor}; margin: 0 0 10px 0;"><strong>Instructions:</strong></p>
        <ol style="color: ${config.textColor}; padding-left: 20px; margin: 0;">
          <li>Share this URL in Warpcast</li>
          <li>Click the "${config.buttonText}" button in the frame</li>
          <li>Get your hilariously inebriated fortune</li>
          <li>Share with friends for more laughs</li>
        </ol>
      </div>
    </div>
    
    <p style="margin-top: 30px; font-size: 0.9em; color: ${config.textColor};">
      Made with ❤️ for Farcaster
    </p>
  </div>
</body>
</html>`;
}

module.exports = {
  isFrameRequest,
  getBaseUrl,
  createFrameMetadata,
  generateFrameHtml
};