console.log("--- Loading api/xumm.js ---");
import { XummSdk } from 'xumm-sdk';

// This handler will be deployed as a Vercel Serverless Function.
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Initialize the SDK securely on the server using environment variables.
    const sdk = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET);
    const { action, payload } = req.body;
    let result;

    switch (action) {
      case 'createPayload':
        result = await sdk.payload.create(payload);
        break;
      case 'getPayload':
        if (typeof payload !== 'string') {
          return res.status(400).json({ message: 'Invalid payload UUID for getPayload.' });
        }
        result = await sdk.payload.get(payload);
        break;
      case 'subscribe':
        return res.status(501).json({ message: 'Subscription via proxy not implemented in this example. Use polling.' });
      default:
        return res.status(400).json({ message: 'Invalid action specified.' });
    }
    res.status(200).json(result);

  } catch (error) {
    console.error('API Proxy Error:', error);
    res.status(500).json({ message: 'An error occurred during the XUMM API request.' });
  }
}