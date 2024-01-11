import { RaceStatus } from "./enums/raceStatus";
import type Racer from "./racer";

// dbRaceInfo is connected
export class RaceInfo{
    id: string;
    raceStatus: RaceStatus;
    startDate: Date;
    startMillis: number = -1
    countdownEndMillis: number = -1
    racers: Racer[] = []

    constructor(raceStatus: RaceStatus){
        this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        this.raceStatus = raceStatus;
        this.startDate = new Date(Date.now()); 
    }
}