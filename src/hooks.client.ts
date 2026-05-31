import { LocalStorageDatabase } from "$lib/storage/localstorage/localStorageDatabase";
import { currentPractice,  newRaceInfo, sessionStatus } from "$lib/stores/raceInfos";
import { RaceInfo } from "$lib/_types/raceInfo";
import { RaceStatus } from "$lib/_types/enums/raceStatus";
import { raceHistory } from "$lib/stores/raceHistory";
import { get } from "svelte/store";
import type { IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
import { WsServer } from '$lib/services/websocket/wsServer';
import { getSavedSensorIp } from '$lib/utils/localSettings';
import { newRaceSession } from '$lib/utils/raceInfoSession';


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

sessionStatus.subscribe(status => {
    if(status == RaceStatus.FORMATION){
        newRaceSession();
    }
})

getSavedSensorIp();

let ws = new WsServer();

export function handleError({ error }: { error: unknown }) {
    console.error(error);
}
