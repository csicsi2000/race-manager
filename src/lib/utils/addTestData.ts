import { RaceStatus } from "$lib/_types/enums/raceStatus";
import { RaceInfo } from "$lib/_types/raceInfo";
import Racer from "$lib/_types/racer";
import { currentRaceInfo } from "$lib/stores/raceInfos";
import { get } from "svelte/store";

export default function addRacers(){
    let info = new RaceInfo(RaceStatus.PRACTICE);
    simulateLaps();
}

let oldRaceInfo :RaceInfo;

let time1 = 20;
let time2 = 20;

let less = 3;
let more = 5;
async function simulateLaps(): Promise<void> {
    while (true) {
      // Your asynchronous code goes here
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Running every 2 seconds...");
      oldRaceInfo = get(currentRaceInfo);
      if(oldRaceInfo.racers.length == 0){
        console.log("0 racer");
        continue;
      }
      oldRaceInfo.racers[1].lapTimes.push(time1);
        oldRaceInfo.racers[0].lapTimes.push(time2);
        time1 = time1 + less ;
        time2 = time2 + more ;

        let temp = less;
        less = more;
        more = temp;
      currentRaceInfo.set(oldRaceInfo);
    }
  }