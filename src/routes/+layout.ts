import type {LayoutLoad} from "../../.svelte-kit/types/src/routes/$types";
export const ssr = false;
export const prerender = true;
import { building } from '$app/environment';
import { LocalStorageDatabase } from "$lib/storage/localstorage/localStorageDatabase";
import { currentRaceInfo, newRaceInfo } from "$lib/stores/raceInfos";
import { RaceInfo } from "$lib/_types/raceInfo";
import { RaceStatus } from "$lib/_types/enums/raceStatus";

if (!building) {
	let database = new LocalStorageDatabase();
    let previousRaceConfig:RaceInfo 
    try{
        previousRaceConfig = database.getRaceConfig();
        console.log("Config from localstorage");
        previousRaceConfig.racers.forEach((value, index) => {
            previousRaceConfig.racers
        })
    }
    catch{
        previousRaceConfig = new RaceInfo(RaceStatus.PRACTICE);
    }
    currentRaceInfo.set(previousRaceConfig);
    newRaceInfo.set(previousRaceConfig);
}

export const load: LayoutLoad = async () => {
    
}