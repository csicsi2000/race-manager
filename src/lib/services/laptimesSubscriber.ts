import type { IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
import type { SensorData } from "$lib/_types/sensorData";
import { applySensorReading } from "$lib/services/lapCounter";
import { sensorReadings, sensorSetting } from "$lib/stores/serverStatus";
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
    })
}
