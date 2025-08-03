console.log("--- Loading player.js ---");
import { iOSAudio } from './ios-audio.js';

let audio;
let audioSourceNode;

export const Player = {
    init() {
        if (audio) return;
        iOSAudio.unlock();
        audio = new Audio();
        audio.crossOrigin = "anonymous";
        const audioContext = iOSAudio.audioContext;
        audioSourceNode = audioContext.createMediaElementSource(audio);
    },
    loadTrack(url) {
        audio.src = url;
    },
    play() { audio.play(); },
    pause() { audio.pause(); },
    getAudioSourceNode() { return audioSourceNode; }
};