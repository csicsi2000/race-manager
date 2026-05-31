import { RaceStatus } from "$lib/_types/enums/raceStatus";
import { raceHistory } from "$lib/stores/raceHistory";
import { currentPractice, currentRace, newRaceInfo, sessionStatus } from "$lib/stores/raceInfos";
import {get} from 'svelte/store';
import { getUniqueName } from "./uniqueNameGenerator";
import type { IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
import { subscribeSessionToSensor } from "$lib/services/laptimesSubscriber";

export function startFormation() {
    sessionStatus.set(RaceStatus.FORMATION);
}

export function cancelRace() {
    sessionStatus.set(RaceStatus.PRACTICE);
    currentRace.set(null);
    newPracticeSession();
  }

export function newPracticeSession(){
    let newPractice = structuredClone(get(newRaceInfo));
    savePreviousSession(get(currentPractice));
    newPractice.raceStatus = RaceStatus.PRACTICE;
    newPractice.startDate = new Date();
    newPractice.startMillis = -1;
    newPractice.raceName = getUniqueName();
    newPractice.racers.forEach(x => {
        x.lapTimes = [];
        x.bestLapTime = -1;
        x.startMillis = -1;
    });
    currentPractice.set(newPractice);

    subscribeSessionToSensor(currentPractice);
    generateNewRaceInfo(newPractice);
}

export function newRaceSession(){
    let prepareRace = structuredClone(get(newRaceInfo));
    savePreviousSession(get(currentPractice));

    prepareRace.raceStatus = RaceStatus.RACE;
    prepareRace.startMillis = -1;
    prepareRace.racers.forEach(x => {
        x.lapTimes = [];
        x.bestLapTime = -1;
        x.startMillis = -1;
    });
    prepareRace.startDate = new Date();
    currentRace.set(prepareRace);

    subscribeSessionToSensor(currentRace);
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
    if (!raceInfo?.racers?.some((racer) => racer.lapTimes.length > 0)) {
        return;
    }
    let history = get(raceHistory);
    if (history.some((item) => item.id === raceInfo.id)) {
        return;
    }
    history.push(raceInfo);
    raceHistory.set(history);
}
