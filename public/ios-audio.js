// Manages audio context to ensure compatibility with iOS.
export const iOSAudio = {
    audioContext: null,
    
    // This must be called after a user interaction (e.g., a button click).
    unlock() {
        if (this.audioContext) {
            return; // Already unlocked
        }
        
        console.log('Attempting to unlock audio context...');
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // A simple "silent" sound is played on user interaction to unlock the audio context.
        const buffer = this.audioContext.createBuffer(1, 1, 22050);
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(0);
        
        // Resume the context if it's in a suspended state.
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('Audio context resumed successfully.');
            });
        } else {
            console.log('Audio context was already active.');
        }
    },

    // A simple function to play a beep sound.
    playBeep() {
        if (!this.audioContext) {
            console.warn('Audio context not unlocked. Cannot play sound.');
            return;
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4 pitch
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2); // Play for 0.2 seconds
    }
};