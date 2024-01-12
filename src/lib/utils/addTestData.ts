import { RaceStatus } from "$lib/_types/enums/raceStatus";
import { RaceInfo } from "$lib/_types/raceInfo";
import Racer from "$lib/_types/racer";
import { raceInfo } from "$lib/stores/currentRaceInfo";

export default function addRacers(){
    let info = new RaceInfo(RaceStatus.PRACTICE);

    let racer1 = new Racer(0,"test_1")
    racer1.name = "Béla"
    racer1.lapTimes = [4,765,43563,345636,243,234,324,234,324,234,324]

    let racer2 = new Racer(1,"")

    racer2.name = "Ági"
    racer2.lapTimes = [1,5,7,122,912]

    info.racers.push(racer1)
    info.racers.push(racer2)

    
    raceInfo.set(info)
    simulateLaps();
}

let oldRaceInfo :RaceInfo;
raceInfo.subscribe( x => oldRaceInfo = x);

let time = 20;
async function simulateLaps(): Promise<void> {
    while (true) {
      // Your asynchronous code goes here
      console.log("Running every 2 seconds...");
      oldRaceInfo.racers[1].lapTimes.push(time);
        oldRaceInfo.racers[0].lapTimes.push(time);
        time = time + 30;
      raceInfo.set(oldRaceInfo);
      console.log(oldRaceInfo);
      // Wait for 2 seconds before running again
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }