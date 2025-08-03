import { UIManager } from './state-manager.js';
import { iOSAudio } from './ios-audio.js';
import { Player } from './player.js';
import { Visualizer } from './visualizer.js';

const POLLING_INTERVAL = 2000;
let pollingIntervalId = null;

async function api(action, payload) {
    const response = await fetch('/api/xumm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
    });

    if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorText;
        if (contentType && contentType.includes("application/json")) {
            const errorJson = await response.json();
            errorText = errorJson.message || 'API request failed (JSON)';
        } else {
            errorText = await response.text();
        }
        throw new Error(errorText);
    }
    
    return response.json();
}

async function signIn() {
    UIManager.reset();
    iOSAudio.unlock();
    UIManager.setLoading();
    try {
        const payload = await api('createPayload', { txjson: { TransactionType: 'SignIn' } });
        UIManager.displayQRCode(payload.refs.qr_png);
        startPolling(payload.uuid);
    } catch (error) {
        console.error('Sign-in error:', error);
        UIManager.setError(error.message);
    }
}

function startPolling(uuid) {
    if (pollingIntervalId) clearInterval(pollingIntervalId);
    pollingIntervalId = setInterval(async () => {
        try {
            const status = await api('getPayload', uuid);
            if (status.meta.signed) {
                clearInterval(pollingIntervalId);
                loadAndDisplayNFTs(status.response);
            } else if (status.meta.cancelled) {
                clearInterval(pollingIntervalId);
                UIManager.setError('Sign-in request was cancelled.');
            }
        } catch (error) {
            clearInterval(pollingIntervalId);
            UIManager.setError(error.message);
        }
    }, POLLING_INTERVAL);
}

async function loadAndDisplayNFTs(authData) {
    UIManager.showPlayer();
    const userAddress = authData.account;
    // This line is now updated to the Mainnet server
    const client = new xrpl.Client("wss://xrplcluster.com/");

    try {
        await client.connect();
        const response = await client.request({ command: "account_nfts", account: userAddress });
        let playableNFTs = [];
        for (const nft of response.result.account_nfts) {
            if (nft.URI) {
                const uriString = xrpl.convertHexToString(nft.URI);
                try {
                    const metaResponse = await fetch(uriString.startsWith('ipfs://') ? uriString.replace('ipfs://', 'https://ipfs.io/ipfs/') : uriString);
                    const metadata = await metaResponse.json();
                    if (metadata.audio || metadata.animation_url) {
                        playableNFTs.push({
                            title: metadata.name || 'Untitled NFT',
                            audio: (metadata.audio || metadata.animation_url).replace('ipfs://', 'https://ipfs.io/ipfs/')
                        });
                    }
                } catch (e) { console.warn(`Could not process metadata for URI: ${uriString}`, e); }
            }
        }
        UIManager.displayNFTPlaylist(playableNFTs);
        initializePlayer();
    } catch (error) {
        console.error("Error fetching NFTs:", error);
        document.getElementById('playlist').textContent = 'Error loading NFTs.';
    } finally {
        if (client.isConnected()) await client.disconnect();
    }
}

function initializePlayer() {
    Player.init();
    const canvas = document.getElementById('visualizer-canvas');
    Visualizer.init(canvas, Player.getAudioSourceNode());
    Visualizer.start();

    document.getElementById('playlist').addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('playlist-item')) {
            const trackUrl = event.target.dataset.audioSrc;
            const trackTitle = event.target.textContent;
            document.getElementById('track-title').textContent = `Now Playing: ${trackTitle}`;
            Player.loadTrack(trackUrl);
            Player.play();
            document.getElementById('playPauseButton').textContent = 'Pause';
        }
    });

    const playPauseButton = document.getElementById('playPauseButton');
    playPauseButton.addEventListener('click', () => {
        if (playPauseButton.textContent === 'Pause') {
            Player.pause();
            playPauseButton.textContent = 'Play';
        } else {
            Player.play();
            playPauseButton.textContent = 'Pause';
        }
    });
}

UIManager.signInButton.addEventListener('click', signIn);