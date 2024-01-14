import { RaceStatus } from "./enums/raceStatus";
import Racer from "./racer";
import { type IRaceInfo } from "./interfaces/IRaceInfo";
import type { IRacer } from "./interfaces/IRacer";
export class RaceInfo implements IRaceInfo{
    id: string;
    raceName: string;
    raceStatus: RaceStatus;
    startDate: Date;
    startMillis: number = -1;
    countdownEndMillis: number = -1;
    lapCount: number = 10;
    racers: IRacer[] = [];

    constructor(raceStatus: RaceStatus){
        this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        this.raceStatus = raceStatus;
        this.startDate = new Date(); 
        this.raceName = this.startDate.toLocaleString("hu-HU");

        this.addRacer("Slot_1");
        this.addRacer("Slot_2");
    }

    private addRacer(name:string){
        this.racers.push(new Racer(this.racers.length, name));
    }
}