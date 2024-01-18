import type { IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
import type { RaceInfo } from "$lib/_types/raceInfo";
import type { SensorData } from "$lib/_types/sensorData";
import { sensorReadings } from "$lib/stores/serverStatus";
import { get, type Unsubscriber, type Writable } from "svelte/store";

let currentUnsubscribe: Unsubscriber;
let previousReading: SensorData;

export function subscribeSessionToSensor(session: Writable<IRaceInfo|null>){
    if(currentUnsubscribe){
        currentUnsubscribe();
    }
    currentUnsubscribe = sensorReadings.subscribe((reading) => {
        if(!reading){
            return;
        }
        if(!previousReading){
            previousReading = reading;
            return;
        }
        let tempSession = GetLapTime(get(session), previousReading, reading);
        session.set(tempSession);
        previousReading = reading;
    })


}

function GetLapTime(raceInfo: IRaceInfo|null, prevRead: SensorData, newRead: SensorData): IRaceInfo|null
{
    if(raceInfo == null){
       return null;
    }
    
    newRead.slot_status?.forEach((status, index) => {
        if(status == true && prevRead.slot_status[index] != true){
            console.log("Laptime set " + index);
            raceInfo.racers[index].lapTimes.push(newRead.millis);
        }
    })    

    return raceInfo;
}