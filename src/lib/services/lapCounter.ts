import { RaceStatus } from "$lib/_types/enums/raceStatus";
import type { IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
import type { IRacer } from "$lib/_types/interfaces/IRacer";
import type { SensorData } from "$lib/_types/sensorData";
import type { SensorSettings } from "$lib/_types/sensorSettings";
import Racer from "$lib/_types/racer";
import { announcePersonalBest, announcePositionChange, announceRaceFinished } from "$lib/services/voiceCues";

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

/**
 * Get current sorted positions. Returns an array of racer names in order of position.
 */
function getPositions(racers: IRacer[]): string[] {
    return [...racers].sort(Racer.racerCompare).map(r => r.name);
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

    // Don't process laps if the race is already finished
    if (raceInfo.raceStatus === RaceStatus.FINISHED) {
        return raceInfo;
    }

    if (raceInfo.startMillis < 0) {
        raceInfo.startMillis = previousReading.millis >= 0 ? previousReading.millis : newReading.millis;
    }

    const laneCount = Math.min(settings.laneCount, raceInfo.racers.length, newReading.slot_status.length);
    const isRaceMode = raceInfo.raceStatus === RaceStatus.RACE;

    // Capture positions before any updates (for race mode position change detection)
    const positionsBefore = isRaceMode ? getPositions(raceInfo.racers) : [];

    for (let laneIndex = 0; laneIndex < laneCount; laneIndex += 1) {
        const wasBlocked = previousReading.slot_status[laneIndex] === true;
        const isBlocked = newReading.slot_status[laneIndex] === true;
        if (!isBlocked || wasBlocked) {
            continue;
        }

        const racer = raceInfo.racers[laneIndex];

        // In race mode, skip racers who already finished
        if (isRaceMode && raceInfo.lapCount > 0 && racer.lapTimes.length >= raceInfo.lapCount) {
            continue;
        }

        if (racer.startMillis < 0) {
            racer.startMillis = raceInfo.startMillis;
        }

        const lastLapMillis = racer.lapTimes.at(-1) ?? racer.startMillis;
        const lapMillis = newReading.millis - lastLapMillis;
        if (lapMillis < settings.minLapMillis) {
            console.warn(`Ignored lane ${laneIndex + 1} trigger below min lap time: ${lapMillis}ms`);
            continue;
        }

        // Track old best for personal best detection
        const oldBest = racer.bestLapTime;

        racer.lapTimes = [...racer.lapTimes, newReading.millis];

        // Update best lap time
        if (oldBest <= 0 || lapMillis < oldBest) {
            const isNewBest = oldBest > 0 && lapMillis < oldBest;
            racer.bestLapTime = lapMillis;

            // Practice mode: announce personal best (not the first lap, only beaten records)
            if (!isRaceMode && isNewBest) {
                announcePersonalBest(racer);
            }
        }

        // Race mode: check if this racer just finished
        if (isRaceMode && raceInfo.lapCount > 0 && racer.lapTimes.length >= raceInfo.lapCount) {
            const finishedCount = raceInfo.racers.filter(r => r.lapTimes.length >= raceInfo.lapCount).length;
            announceRaceFinished(racer, finishedCount);

            // Check if ALL racers have finished → end the race
            const allFinished = raceInfo.racers
                .slice(0, laneCount) // only count active lanes
                .every(r => r.lapTimes.length >= raceInfo.lapCount);
            if (allFinished) {
                raceInfo.raceStatus = RaceStatus.FINISHED;
            }
        }
    }

    // Race mode: detect position changes after all laps are processed
    if (isRaceMode && raceInfo.raceStatus !== RaceStatus.FINISHED) {
        const positionsAfter = getPositions(raceInfo.racers);
        for (let i = 0; i < positionsAfter.length; i++) {
            const name = positionsAfter[i];
            const oldPos = positionsBefore.indexOf(name);
            const newPos = i;
            // Only announce if position improved (lower index = better)
            if (oldPos >= 0 && newPos < oldPos) {
                const racer = raceInfo.racers.find(r => r.name === name);
                if (racer) {
                    announcePositionChange(racer, newPos + 1);
                }
            }
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
