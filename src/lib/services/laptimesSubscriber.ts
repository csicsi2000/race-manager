import type { IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
import type { SensorData } from "$lib/_types/sensorData";
import { RaceStatus } from "$lib/_types/enums/raceStatus";
import { applySensorReading } from "$lib/services/lapCounter";
import { sensorReadings, sensorSetting } from "$lib/stores/serverStatus";
import { sessionStatus } from "$lib/stores/raceInfos";
import { get, type Unsubscriber, type Writable } from "svelte/store";

let currentUnsubscribe: Unsubscriber;
let previousReading: SensorData | null = null;

export function subscribeSessionToSensor(session: Writable<IRaceInfo|null>){
    if(currentUnsubscribe){
        currentUnsubscribe();
    }
    previousReading = null;
    currentUnsubscribe = sensorReadings.subscribe((reading) => {
        if(!reading || reading.millis < 0){
            return;
        }
        if(!previousReading){
            previousReading = reading;
            return;
        }
        let tempSession = applySensorReading(get(session), previousReading, reading, get(sensorSetting));
        session.set(tempSession);
        previousReading = reading;

        // Auto-transition session status when the race finishes
        if (tempSession && tempSession.raceStatus === RaceStatus.FINISHED) {
            const currentStatus = get(sessionStatus);
            if (currentStatus === RaceStatus.RACE) {
                sessionStatus.set(RaceStatus.FINISHED);
            }
        }
    })
}
