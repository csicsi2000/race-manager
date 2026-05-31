import type { IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
import type { SensorData } from "$lib/_types/sensorData";
import type { SensorSettings } from "$lib/_types/sensorSettings";
import { announceLap, announceRaceFinished } from "$lib/services/voiceCues";

export function parseSensorPayload(payload: unknown): SensorData | null {
    if (typeof payload !== "string") {
        return normalizeSensorData(payload);
    }

    try {
        const parsed = JSON.parse(payload);
        return normalizeSensorData(parsed);
    } catch (error) {
        console.warn("Ignoring invalid sensor payload", error);
        return null;
    }
}

export function applySensorReading(
    raceInfo: IRaceInfo | null,
    previousReading: SensorData | null,
    newReading: SensorData,
    settings: SensorSettings
): IRaceInfo | null {
    if (!raceInfo || !previousReading || newReading.millis < 0) {
        return raceInfo;
    }

    if (raceInfo.startMillis < 0) {
        raceInfo.startMillis = previousReading.millis >= 0 ? previousReading.millis : newReading.millis;
    }

    const laneCount = Math.min(settings.laneCount, raceInfo.racers.length, newReading.slot_status.length);

    for (let laneIndex = 0; laneIndex < laneCount; laneIndex += 1) {
        const wasBlocked = previousReading.slot_status[laneIndex] === true;
        const isBlocked = newReading.slot_status[laneIndex] === true;
        if (!isBlocked || wasBlocked) {
            continue;
        }

        const racer = raceInfo.racers[laneIndex];
        if (racer.startMillis < 0) {
            racer.startMillis = raceInfo.startMillis;
        }

        const lastLapMillis = racer.lapTimes.at(-1) ?? racer.startMillis;
        const lapMillis = newReading.millis - lastLapMillis;
        if (lapMillis < settings.minLapMillis) {
            console.warn(`Ignored lane ${laneIndex + 1} trigger below min lap time: ${lapMillis}ms`);
            continue;
        }

        racer.lapTimes = [...racer.lapTimes, newReading.millis];
        const lapNumber = racer.lapTimes.length;
        announceLap(racer, lapNumber, raceInfo.lapCount);
        if (raceInfo.lapCount > 0 && lapNumber === raceInfo.lapCount) {
            announceRaceFinished(racer);
        }
    }

    return raceInfo;
}

function isSensorData(value: unknown): value is SensorData {
    if (!value || typeof value !== "object") {
        return false;
    }

    const candidate = value as SensorData;
    return Number.isFinite(Number(candidate.millis)) && Array.isArray(candidate.slot_status);
}

function normalizeSensorData(value: unknown): SensorData | null {
    if (!isSensorData(value)) {
        return null;
    }

    return {
        millis: Number(value.millis),
        slot_status: value.slot_status.map(Boolean)
    };
}
