import type Racer from "$lib/_types/racer";

export function getMillisBehind(backRacer: Racer, frontRacer: Racer):number{
    let currentLap = backRacer.lapTimes.length-1;
    return backRacer.lapTimes[currentLap] - frontRacer.lapTimes[currentLap];
}

export function getBestLapTime(racer: Racer):number {
    
    if(racer.lapTimes.length <= 0 || racer.startTime == -1){
        return 0;
    }
    let bestTime = racer.lapTimes[0] - racer.startTime;

    for (let i = 1; i < racer.lapTimes.length; i++) {
      let current = racer.lapTimes[i] - racer.lapTimes[i - 1];
      if (current == 0) {
        continue;
      }
      if (current < bestTime) {
        bestTime = current;
      }
    }
    return bestTime;
  }