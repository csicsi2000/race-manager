import type { IRacer } from "$lib/_types/interfaces/IRacer";
import type Racer from "$lib/_types/racer";

export function getMillisBehind(backRacer: IRacer, frontRacer: IRacer):number{
    let currentLap = backRacer.lapTimes.length-1;
    return backRacer.lapTimes[currentLap] - frontRacer.lapTimes[currentLap];
}

export function getBestLapTime(racer: IRacer):number {
    
    if(racer.lapTimes.length <= 0 || racer.startMillis == -1){
      console.log("No best lap time");
        return -1;
    }
    let bestTime = racer.lapTimes[0] - racer.startMillis;

    for (let i = 1; i < racer.lapTimes.length; i++) {
      let current = racer.lapTimes[i] - racer.lapTimes[i - 1];
      console.log(current);
      if (current == 0) {
        continue;
      }
      if (current < bestTime) {
        bestTime = current;
      }
    }
    return bestTime;
  }