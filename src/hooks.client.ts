import { browser, building } from '$app/environment';
import { LocalStorageDatabase } from "$lib/storage/localstorage/localStorageDatabase";
import { currentPractice,  newRaceInfo, sessionStatus } from "$lib/stores/raceInfos";
import { RaceInfo } from "$lib/_types/raceInfo";
import { RaceStatus } from "$lib/_types/enums/raceStatus";
import { raceHistory } from "$lib/stores/raceHistory";
import { get } from "svelte/store";
import addRacers from "$lib/utils/addTestData";
import type { IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
import { sensorReadings } from '$lib/stores/serverStatus';
import { WsServer } from '$lib/websocket/wsServer';


let database = new LocalStorageDatabase();
let previousRaceConfig:IRaceInfo ;
try{
    previousRaceConfig = database.getRaceConfig();

    console.log("Config from localstorage");
}
catch{
    previousRaceConfig = new RaceInfo(RaceStatus.PRACTICE);
}
currentPractice.set(previousRaceConfig);
newRaceInfo.set(structuredClone(previousRaceConfig));
raceHistory.set(database.getRaceInfos());

raceHistory.subscribe(x => database.setAllRaceInfos(x));
console.log("Racehistories: " + get(raceHistory).length);

let previousReading = get(sensorReadings);
sensorReadings.subscribe(x => {
    let currentStatus = get(sessionStatus);
    if(currentStatus == RaceStatus.PRACTICE){
        let curPractice = get(currentPractice);
        
        //curPractice.racers[0].lapTimes.push(x.)
    }else if(currentStatus == RaceStatus.RACE){

    }
})
let ws = new WsServer();
addRacers();