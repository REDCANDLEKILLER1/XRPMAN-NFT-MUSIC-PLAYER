// A simple object to manage the UI state of the application.
export const UIManager = {
    // Cache the DOM elements we'll need to manipulate.
    signInButton: document.getElementById('signInButton'),
    authSection: document.getElementById('auth-section'),
    resultSection: document.getElementById('result-section'),
    qrCodeContainer: document.getElementById('qr-code'),
    statusMessage: document.getElementById('status-message'),
    responseOutput: document.getElementById('response-output'),

    // Resets the UI to its initial state, ready for a new sign-in attempt.
    reset() {
        this.authSection.style.display = 'block';
        this.resultSection.style.display = 'none';
        this.signInButton.disabled = false;
        this.signInButton.textContent = 'Sign In with XUMM';
        this.qrCodeContainer.innerHTML = '';
        this.responseOutput.textContent = '';
        this.statusMessage.textContent = 'Waiting for you to sign the request in XUMM...';
        this.statusMessage.style.color = '#f0ad4e'; // Pending color
    },

    // Sets the UI to a loading state while waiting for the QR code.
    setLoading() {
        this.signInButton.disabled = true;
        this.signInButton.textContent = 'Generating QR Code...';
        this.authSection.style.display = 'none';
        this.resultSection.style.display = 'block';
    },
    
    // Displays the QR code for the user to scan.
    displayQRCode(qrUrl, qrMatrix) {
        this.qrCodeContainer.innerHTML = ''; // Clear previous QR code
        const img = document.createElement('img');
        img.src = qrUrl;
        this.qrCodeContainer.appendChild(img);
    },

    // Updates the UI to show that the sign-in was successful.
    setAuthenticated(data) {
        this.statusMessage.textContent = 'Authentication Successful!';
        this.statusMessage.style.color = '#4CAF50'; // Success color
        this.responseOutput.textContent = JSON.stringify(data, null, 2);
        this.qrCodeContainer.innerHTML = ''; // Hide QR code
    },

    // Displays an error message to the user.
    setError(message) {
        this.statusMessage.textContent = 'An error occurred.';
        this.statusMessage.style.color = '#d9534f'; // Error color
        this.responseOutput.textContent = message;
        this.signInButton.disabled = false;
        this.signInButton.textContent = 'Try Again';
        this.authSection.style.display = 'block'; // Show the button again
    }
};