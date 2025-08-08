// api/xumm.js
// Force Node (NOT Edge) so xumm-sdk works
export const config = { runtime: 'nodejs20.x' };

import { XummSdk } from 'xumm-sdk';

const { XUMM_API_KEY, XUMM_API_SECRET } = process.env;

// CORS for web/mobile callers
function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

// Safe JSON (Vercel usually parses, but be defensive)
function getJsonBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body;
}

export default async function handler(req, res) {
  try {
    if (cors(req, res)) return;

    if (!XUMM_API_KEY || !XUMM_API_SECRET) {
      return res.status(500).json({ ok: false, error: 'Missing XUMM_API_KEY / XUMM_API_SECRET' });
    }

    // Health ping: GET /api/xumm?ping=1
    if (req.method === 'GET') {
      if ('ping' in req.query) {
        const sdk = new XummSdk(XUMM_API_KEY, XUMM_API_SECRET);
        const pong = await sdk.ping();
        return res.status(200).json({ ok: true, pong });
      }
      return res.status(405).json({ ok: false, error: 'Use POST for actions.' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    const sdk = new XummSdk(XUMM_API_KEY, XUMM_API_SECRET);
    const { action, payload } = getJsonBody(req);

    if (!action) {
      return res.status(400).json({ ok: false, error: 'Missing action' });
    }

    let result;

    switch (action) {
      case 'createPayload': {
        if (!payload) return res.status(400).json({ ok: false, error: 'payload is required' });
        result = await sdk.payload.create(payload);
        break;
      }
      case 'getPayload': {
        if (typeof payload !== 'string') {
          return res.status(400).json({ ok: false, error: 'payload must be a UUID string for getPayload' });
        }
        result = await sdk.payload.get(payload);
        break;
      }
      case 'subscribe': {
        // not implemented via serverless streaming; use client polling
        return res.status(501).json({ ok: false, error: 'subscribe not implemented; use polling' });
      }
      default:
        return res.status(400).json({ ok: false, error: 'Invalid action' });
    }

    return res.status(200).json({ ok: true, result });
  } catch (err) {
    console.error('xumm handler error:', err);
    return res.status(500).json({ ok: false, error: err?.message || 'Internal error' });
  }
}