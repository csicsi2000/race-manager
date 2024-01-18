import type { RaceInfo } from "$lib/_types/raceInfo";
import type { SensorData } from "$lib/_types/sensorData";
import { sensorReadings } from "$lib/stores/serverStatus";
import type { Unsubscriber, Writable } from "svelte/store";

let currentUnsubscribe: Unsubscriber;
let previousSensorData: SensorData;

export function subscribeToSession(session: Writable<RaceInfo>){
    if(currentUnsubscribe){
        currentUnsubscribe();
    }
    currentUnsubscribe = sensorReadings.subscribe(() => {
        
    })
}

