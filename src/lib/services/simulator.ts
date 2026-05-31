import { get, writable } from "svelte/store";
import { isSimulated, sensorReadings, sensorSetting, connection } from "$lib/stores/serverStatus";
import { ConnectionStatus } from "$lib/_types/enums/connectionStatus";

let simulatorInterval: number | null = null;
let baseMillis = 0;

/** Manual hold state per lane (true = car held on sensor for formation) */
export const manualLaneState = writable<boolean[]>([]);

/** Auto-lap mode toggle */
export const autoLapEnabled = writable<boolean>(false);

// Internal state — not stores, just module-level arrays
let pulseActive: boolean[] = [];   // true during the "on" phase of a pulse
let forceOff: boolean[] = [];      // true during the brief "off" phase before a pulse
let nextLapTimes: number[] = [];
let laneCount = 2;

export function initSimulator() {
    isSimulated.subscribe(simulated => {
        if (simulated) {
            startSimulation();
        } else {
            stopSimulation();
        }
    });
}

/**
 * Trigger a lap pulse on a lane.
 * Creates a guaranteed false→true edge by:
 * 1. Forcing the lane OFF for 80ms (so the previous reading is false)
 * 2. Setting pulse ON for 200ms (creates the false→true edge)
 * 3. Clearing the pulse (back to base state)
 */
export function triggerLanePulse(laneIndex: number) {
    if (laneIndex >= laneCount) return;

    // Phase 1: Force OFF (override even manual hold)
    forceOff[laneIndex] = true;
    pulseActive[laneIndex] = false;

    // Phase 2: After 80ms, turn off the force and set pulse ON
    setTimeout(() => {
        forceOff[laneIndex] = false;
        pulseActive[laneIndex] = true;

        // Phase 3: After 200ms, clear pulse
        setTimeout(() => {
            pulseActive[laneIndex] = false;
        }, 200);
    }, 80);
}

/** Toggle manual hold for a lane */
export function toggleLaneHold(laneIndex: number) {
    const lanes = get(manualLaneState);
    if (laneIndex >= lanes.length) return;
    lanes[laneIndex] = !lanes[laneIndex];
    manualLaneState.set([...lanes]);
}

/** Set all lanes to held (blocked) */
export function blockAllLanes() {
    manualLaneState.set(Array(laneCount).fill(true));
}

/** Set all lanes to unheld (unblocked) */
export function unblockAllLanes() {
    manualLaneState.set(Array(laneCount).fill(false));
}

function startSimulation() {
    if (simulatorInterval) return;

    connection.set(ConnectionStatus.CONNECTED);
    baseMillis = Date.now();

    const settings = get(sensorSetting);
    laneCount = settings.laneCount || 2;

    // Initialize all arrays
    manualLaneState.set(Array(laneCount).fill(false));
    pulseActive = Array(laneCount).fill(false);
    forceOff = Array(laneCount).fill(false);
    nextLapTimes = Array(laneCount).fill(Infinity);

    simulatorInterval = window.setInterval(() => {
        const now = Date.now();
        const settings = get(sensorSetting);
        laneCount = settings.laneCount || 2;
        const manual = get(manualLaneState);
        const autoLap = get(autoLapEnabled);

        // Ensure arrays are the right size
        while (manual.length < laneCount) manual.push(false);
        while (pulseActive.length < laneCount) pulseActive.push(false);
        while (forceOff.length < laneCount) forceOff.push(false);
        while (nextLapTimes.length < laneCount) nextLapTimes.push(Infinity);

        // Auto-lap: trigger pulses on schedule
        if (autoLap) {
            for (let i = 0; i < laneCount; i++) {
                if (now >= nextLapTimes[i] && !pulseActive[i] && !forceOff[i]) {
                    // Schedule next lap
                    const minLap = settings.minLapMillis > 0 ? settings.minLapMillis : 3000;
                    nextLapTimes[i] = now + minLap + Math.floor(Math.random() * 500) + (i * 150);
                    // Fire a pulse
                    triggerLanePulse(i);
                }
            }
        }

        // Compute final slot_status
        // forceOff overrides everything to false (to guarantee edge)
        // otherwise: manual hold OR pulse active
        const slot_status = Array(laneCount).fill(false);
        for (let i = 0; i < laneCount; i++) {
            if (forceOff[i]) {
                slot_status[i] = false;
            } else {
                slot_status[i] = (manual[i] || false) || pulseActive[i];
            }
        }

        sensorReadings.set({
            millis: now - baseMillis,
            slot_status
        });
    }, 50);
}

/** Start auto-lap timers */
export function startAutoLap() {
    const settings = get(sensorSetting);
    const minLap = settings.minLapMillis > 0 ? settings.minLapMillis : 3000;
    for (let i = 0; i < laneCount; i++) {
        nextLapTimes[i] = Date.now() + minLap + (i * 200);
    }
    autoLapEnabled.set(true);
}

/** Stop auto-lap timers */
export function stopAutoLap() {
    for (let i = 0; i < nextLapTimes.length; i++) {
        nextLapTimes[i] = Infinity;
    }
    autoLapEnabled.set(false);
}

function stopSimulation() {
    if (simulatorInterval) {
        clearInterval(simulatorInterval);
        simulatorInterval = null;
    }
    pulseActive = [];
    forceOff = [];
    nextLapTimes = [];
    manualLaneState.set([]);
    autoLapEnabled.set(false);
    connection.set(ConnectionStatus.DISCONNECTED);
}
