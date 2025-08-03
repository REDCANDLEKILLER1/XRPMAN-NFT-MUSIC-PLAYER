export const UIManager = {
    signInButton: document.getElementById('signInButton'),
    authSection: document.getElementById('auth-section'),
    resultSection: document.getElementById('result-section'),
    qrCodeContainer: document.getElementById('qr-code'),
    statusMessage: document.getElementById('status-message'),
    responseOutput: document.getElementById('response-output'),

    reset() {
        this.authSection.style.display = 'block';
        this.resultSection.style.display = 'none';
        document.getElementById('player-section').style.display = 'none';
        this.signInButton.disabled = false;
        this.signInButton.textContent = 'Sign In with XUMM';
    },
    setLoading() {
        this.signInButton.disabled = true;
        this.signInButton.textContent = 'Generating QR Code...';
        this.authSection.style.display = 'none';
        this.resultSection.style.display = 'block';
    },
    displayQRCode(qrUrl) {
        this.qrCodeContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = qrUrl;
        this.qrCodeContainer.appendChild(img);
    },
    setError(message) {
        this.statusMessage.textContent = 'An error occurred.';
        this.statusMessage.style.color = '#d9534f';
        this.responseOutput.textContent = message;
        this.responseOutput.style.color = '#d9534f';
        this.signInButton.disabled = false;
        this.signInButton.textContent = 'Try Again';
        this.authSection.style.display = 'block';
    },
    showPlayer() {
        this.authSection.style.display = 'none';
        this.resultSection.style.display = 'none';
        document.getElementById('player-section').style.display = 'block';
    },
    displayNFTPlaylist(nftList) {
        const playlistEl = document.getElementById('playlist');
        playlistEl.innerHTML = '';
        if (nftList.length === 0) {
            playlistEl.textContent = 'No playable audio NFTs found.';
            return;
        }
        nftList.forEach(nft => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.textContent = nft.title;
            item.dataset.audioSrc = nft.audio; 
            playlistEl.appendChild(item);
        });
    }
};