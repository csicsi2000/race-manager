import { browser } from "$app/environment";
import type { IRacer } from "$lib/_types/interfaces/IRacer";
import { get } from "svelte/store";
import { sensorSetting } from "$lib/stores/serverStatus";

let lastSpokenAt = 0;

function speak(text: string) {
    if (!browser || !get(sensorSetting).voiceCues || !("speechSynthesis" in window)) {
        return;
    }

    const now = Date.now();
    if (now - lastSpokenAt < 650) {
        window.speechSynthesis.cancel();
    }
    lastSpokenAt = now;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

/** Practice mode: announce when a racer beats their own best lap time */
export function announcePersonalBest(racer: IRacer) {
    speak(`${racer.name}, new personal best`);
}

/** Race mode: announce when a racer changes position */
export function announcePositionChange(racer: IRacer, newPosition: number) {
    if (newPosition === 1) {
        speak(`${racer.name} takes the lead`);
    } else {
        speak(`${racer.name} moves to position ${newPosition}`);
    }
}

/** Race mode: announce when a racer finishes the race */
export function announceRaceFinished(racer: IRacer, position: number) {
    if (position === 1) {
        speak(`${racer.name} wins the race`);
    } else {
        speak(`${racer.name} finishes in position ${position}`);
    }
}

/** Race mode: announce when the entire race is over */
export function announceRaceOver() {
    speak("Race over");
}
