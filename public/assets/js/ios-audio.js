export const iOSAudio = {
    audioContext: null,
    unlock() {
        if (this.audioContext) return;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
};