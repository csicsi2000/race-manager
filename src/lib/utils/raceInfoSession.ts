import { RaceStatus } from "$lib/_types/enums/raceStatus";
import type { RaceInfo } from "$lib/_types/raceInfo";
import { LocalStorageDatabase } from "$lib/storage/localstorage/localStorageDatabase";
import { raceHistory } from "$lib/stores/raceHistory";
import { currentPractice, currentRace, newRaceInfo, sessionStatus } from "$lib/stores/raceInfos";
import {get} from 'svelte/store';
import { getUniqueName } from "./uniqueNameGenerator";
import type { IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
import { PageRoutes } from "$lib/_types/enums/pageRoutes";
import { routeToPage } from "./navigationHelper";

export function startFormation() {
    sessionStatus.set(RaceStatus.FORMATION);
    routeToPage(PageRoutes.RACE,true);
    console.log(PageRoutes.RACE)
}

export function cancelRace() {
    sessionStatus.set(RaceStatus.PRACTICE);
    currentRace.set(null);
    newPracticeSession();
  }

export function newPracticeSession(){
    let newPractice = structuredClone(get(newRaceInfo));
    savePreviousSession(get(currentPractice));
    newPractice.startDate = new Date();
    newPractice.raceName = getUniqueName();
    currentPractice.set(newPractice);

    generateNewRaceInfo(newPractice);
}

export function newRaceSession(){
    let prepareRace = get(newRaceInfo);
    savePreviousSession(get(currentPractice));

    prepareRace.raceStatus = RaceStatus.RACE;
    prepareRace.racers.forEach(x => x.lapTimes = []);
    prepareRace.startDate = new Date();
    currentRace.set(prepareRace);

    generateNewRaceInfo(prepareRace);
}

function generateNewRaceInfo(oldRaceInfo: IRaceInfo):IRaceInfo{
    let raceInfo = structuredClone(oldRaceInfo);
    raceInfo.startDate = new Date();
    raceInfo.raceStatus = RaceStatus.PRACTICE;
    raceInfo.racers.forEach(x => x.lapTimes = []);
    raceInfo.raceName = getUniqueName();
    newRaceInfo.set(raceInfo);

    return raceInfo;
}

function savePreviousSession(raceInfo: IRaceInfo){
    let history = get(raceHistory);
    history.push(raceInfo);
    raceHistory.set(history);
}