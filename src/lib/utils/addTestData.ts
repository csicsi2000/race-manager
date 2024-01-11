import { RaceStatus } from "$lib/_types/enums/raceStatus";
import { RaceInfo } from "$lib/_types/raceInfo";
import Racer from "$lib/_types/racer";
import { raceInfo } from "$lib/stores/raceInfo";

export default function addRacers(){
    let info = new RaceInfo(RaceStatus.PRACTICE);

    let racer1 = new Racer(0,"test_1")
    racer1.name = "Béla"
    racer1.lapTimes = [4,765,43563,345636,]

    let racer2 = new Racer(1,"")

    racer2.name = "Ági"
    racer2.lapTimes = [1,5,7,122,912]

    info.racers.push(racer1)
    info.racers.push(racer2)

    raceInfo.set(info)
}