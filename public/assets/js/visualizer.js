console.log("--- Loading visualizer.js ---");
import { iOSAudio } from './ios-audio.js';

let canvasCtx;
let analyser;
let dataArray;
let bufferLength;

export const Visualizer = {
    init(canvasElement, audioSourceNode) {
        const audioContext = iOSAudio.audioContext;
        canvasCtx = canvasElement.getContext('2d');
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        audioSourceNode.connect(analyser);
        analyser.connect(audioContext.destination);
    },
    start() {
        this.draw();
    },
    draw() {
        requestAnimationFrame(() => this.draw());
        analyser.getByteFrequencyData(dataArray);
        const { width, height } = canvasCtx.canvas;
        canvasCtx.fillStyle = '#111';
        canvasCtx.fillRect(0, 0, width, height);
        const barWidth = (width / bufferLength) * 1.5;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] * 0.75;
            canvasCtx.fillStyle = `rgb(50, ${barHeight + 100}, 200)`;
            canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }
};