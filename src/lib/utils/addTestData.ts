import { RaceStatus } from "$lib/_types/enums/raceStatus";
import type { IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
import { RaceInfo } from "$lib/_types/raceInfo";
import { currentPractice, currentRace } from "$lib/stores/raceInfos";
import { get } from "svelte/store";

export default function addRacers(){
    let info = new RaceInfo(RaceStatus.PRACTICE);
    info.startMillis = 20;
    simulateLaps();
}

let oldRaceInfo :IRaceInfo;

let time1 = 20;
let time2 = 20;

async function simulateLaps(): Promise<void> {
  oldRaceInfo = get(currentPractice);
  while (true) {
    // Your asynchronous code goes here
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Running every 2 seconds...");
    oldRaceInfo = get(currentPractice);
    if(oldRaceInfo.racers.length == 0){
      console.log("0 racer");
      continue;
    }
      oldRaceInfo.startMillis = 20;
      oldRaceInfo.racers[0].startMillis = 20;
      oldRaceInfo.racers[1].startMillis = 20;
      time1 = time1 + randomInt(1000,2000) ;
      time2 = time2 + randomInt(1000,2000) ;
      oldRaceInfo.racers[0].lapTimes.push(time2);
      oldRaceInfo.racers[1].lapTimes.push(time1);
        currentPractice.set(oldRaceInfo);
        if(get(currentRace) != null){
        currentRace.set(oldRaceInfo);}
    }
  }

  function randomInt(min:number, max:number){
    return Math.floor(Math.random() * (max - min + 1)) + min;
 }