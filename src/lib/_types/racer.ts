// dbRacer is connected
export default class Racer{
    raceId: number = -1;
    name: string = "";
    startTime: number = -1;
    lapTimes: number[] = [];
    color: string = "#00FFFFFF";
    jumpStart: number = 0;

    constructor(raceId: number, name: string){
        this.raceId = raceId;
        this.name = name;
    }

    static racerCompare(racer1: Racer, racer2: Racer){
        if(racer1.lapTimes.length > racer2.lapTimes.length){
            return 1;
        }
        if(racer1.lapTimes.length < racer2.lapTimes.length){
            return -1;
        }

        let lastLap = racer1.lapTimes.length -1;
        if(racer1.lapTimes[lastLap] > racer2.lapTimes[lastLap] ){
            return 1;
        }
        if(racer1.lapTimes[lastLap] < racer2.lapTimes[lastLap] ){
            return -1;
        }
        return 0;
    }

    getMillisBehind(frontRacer: Racer):number{
        let currentLap = this.lapTimes.length-1;
        return this.lapTimes[currentLap] - frontRacer.lapTimes[currentLap];
    }

    getBestLapTime() {
        let bestTime = this.lapTimes[0] - this.startTime;

        for (let i = 1; i < this.lapTimes.length; i++) {
          let current = this.lapTimes[i] - this.lapTimes[i - 1];
          if (current == 0) {
            continue;
          }
          if (current < bestTime) {
            bestTime = current;
          }
        }
        return bestTime;
      }
}