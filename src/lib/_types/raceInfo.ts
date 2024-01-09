import { RaceStatus } from "./enums/raceStatus";
import type Racer from "./racer";

export class RaceInfo{
    raceStatus: RaceStatus;
    startTime: number = -1
    countdownTime: number = -1
    racers: Racer[] = []

    constructor(raceStatus: RaceStatus){
        this.raceStatus = raceStatus;
    }
}