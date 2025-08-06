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
    // These are never exposed to the client.
    const sdk = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET);

    const { action, payload } = req.body;

    let result;

    // A simple router to handle different XUMM SDK actions based on
    // what the client-side code requests.
    switch (action) {
      case 'createPayload':
        result = await sdk.payload.create(payload);
        break;
      case 'getPayload':
        // Ensure payload is a string (UUID) for get requests
        if (typeof payload !== 'string') {
          return res.status(400).json({ message: 'Invalid payload UUID for getPayload.' });
        }
        result = await sdk.payload.get(payload);
        break;
      case 'subscribe':
         // This is a more complex action involving websockets, which is better handled
         // by polling `getPayload` from the client for this simple proxy architecture.
         // For a real-time experience, you would set up a websocket connection here.
         // For now, we will just return a message.
         return res.status(501).json({ message: 'Subscription via proxy not implemented in this example. Use polling.' });
      default:
        return res.status(400).json({ message: 'Invalid action specified.' });
    }

    // Send the successful response from XUMM back to the client.
    res.status(200).json(result);

  } catch (error) {
    console.error('API Proxy Error:', error);
    // Be careful not to expose detailed internal errors to the client
    res.status(500).json({ message: 'An error occurred during the XUMM API request.' });
  }
}
