import { browser } from "$app/environment";
import type { IRacer } from "$lib/_types/interfaces/IRacer";
import { get } from "svelte/store";
import { sensorSetting } from "$lib/stores/serverStatus";

let lastSpokenAt = 0;

export function announceLap(racer: IRacer, lapNumber: number, lapCount?: number) {
    if (!browser || !get(sensorSetting).voiceCues || !("speechSynthesis" in window)) {
        return;
    }

    const now = Date.now();
    if (now - lastSpokenAt < 650) {
        window.speechSynthesis.cancel();
    }
    lastSpokenAt = now;

    const total = lapCount && lapCount > 0 ? ` of ${lapCount}` : "";
    const utterance = new SpeechSynthesisUtterance(`${racer.name}, lap ${lapNumber}${total}`);
    utterance.rate = 1.05;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

export function announceRaceFinished(racer: IRacer) {
    if (!browser || !get(sensorSetting).voiceCues || !("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.speak(new SpeechSynthesisUtterance(`${racer.name} finished`));
}
