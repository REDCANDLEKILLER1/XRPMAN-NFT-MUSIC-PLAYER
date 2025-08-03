# XRPMAN NFT Music Player (Secure Edition v2.0)

A token-gated Progressive Web App (PWA) music player for the XRPMAN NFT collection, re-architected for security and production readiness.

## Key Enhancements

  - Secure API Key Management: Implemented a serverless API proxy on Vercel to protect XUMM API credentials, eliminating client-side exposure.
  - Dependency Security: Updated all dependencies to patched versions, mitigating known vulnerabilities like the xrpl.js supply chain attack.
  - Robust Shuffling: Replaced the biased shuffle method with the statistically fair Fisher-Yates algorithm.
  - Modern Deployment: Uses a streamlined Git-based workflow with Vercel for automated, secure deployments.

## Requirements

  - Node.js and npm.
  - A Vercel account (for deployment).
  - An XUMM wallet with at least one XRPMAN NFT.
  - Your XUMM API Key and Secret.

## Local Development