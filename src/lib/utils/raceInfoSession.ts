import { RaceStatus } from "$lib/_types/enums/raceStatus";
import type { RaceInfo } from "$lib/_types/raceInfo";
import { LocalStorageDatabase } from "$lib/storage/localstorage/localStorageDatabase";
import { raceHistory } from "$lib/stores/raceHistory";
import { currentRaceInfo, newRaceInfo } from "$lib/stores/raceInfos";
import {get} from 'svelte/store';
import { getUniqueName } from "./uniqueNameGenerator";


export function newPracticeSession(){
    let newPractice = structuredClone(get(newRaceInfo));
    savePreviousSession(get(currentRaceInfo));
    newPractice.startDate = new Date();
    currentRaceInfo.set(newPractice);

    generateNewSession(newPractice);
}

export function newRaceSession(){
    let prepareRace = get(newRaceInfo);
    savePreviousSession(get(currentRaceInfo));

    prepareRace.raceStatus = RaceStatus.RACE;
    prepareRace.racers.forEach(x => x.lapTimes = []);
    prepareRace.startDate = new Date();
    currentRaceInfo.set(prepareRace);

    generateNewSession(prepareRace);
}

function generateNewSession(raceInfo: RaceInfo):RaceInfo{
    raceInfo.startDate = new Date();
    raceInfo.raceStatus = RaceStatus.PRACTICE;
    raceInfo.racers.forEach(x => x.lapTimes = []);
    raceInfo.raceName = getUniqueName();
    newRaceInfo.set(raceInfo);

    return raceInfo;
}

function savePreviousSession(raceInfo: RaceInfo){
    let history = get(raceHistory);
    history.push(raceInfo);
    raceHistory.set(history);
}