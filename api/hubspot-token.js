/**
 * Secure Backend API Endpoint for HubSpot Token
 * This endpoint retrieves the HubSpot access token securely from environment variables
 * Never expose tokens directly in frontend code
 */

module.exports = (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Retrieve token from environment variable
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!accessToken) {
    console.error('[v0] HUBSPOT_ACCESS_TOKEN environment variable is not set');
    res.status(500).json({ error: 'Access token not configured' });
    return;
  }

  // Return token to frontend
  res.status(200).json({ token: accessToken });
};
