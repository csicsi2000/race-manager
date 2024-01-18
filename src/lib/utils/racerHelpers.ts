import type { IRacer } from "$lib/_types/interfaces/IRacer";
import type Racer from "$lib/_types/racer";

/** Compares tha last lap of the racer, and updates the bestlaptime if it is faster. */
export function getMillisBehind(backRacer: IRacer, frontRacer: IRacer):number{
    let currentLap = backRacer.lapTimes.length-1;
    console.log(backRacer.lapTimes[currentLap] + " ; " + frontRacer.lapTimes[currentLap])
    return backRacer.lapTimes[currentLap] - frontRacer.lapTimes[currentLap];
}

/** Updates the best lap time value for the racer, based on all laps. */
export function updateBestLapTime(racer: IRacer):IRacer{
    
    if(racer.lapTimes.length <= 0 || racer.startMillis == -1){
      console.log("No best lap time");
        return racer;
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
    racer.bestLapTime = bestTime;
    return racer;
  }

  export function getNewBestLapTime(racer: IRacer):IRacer{
    if(racer.lapTimes.length < 2){
      return racer;
    }
    let lastLap = racer.lapTimes[racer.lapTimes.length-1];
    let prevLap = racer.lapTimes[racer.lapTimes.length-2];
    let lapTime = lastLap-prevLap;
    if(!racer.bestLapTime || racer.bestLapTime <= 0){
      racer.bestLapTime = lapTime;
      return racer;
    }

    if(lapTime < racer.bestLapTime ){
      racer.bestLapTime = lapTime;
    }
    return racer;
  }