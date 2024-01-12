import { RaceStatus } from "./enums/raceStatus";
import type Racer from "./racer";
import { uniqueNamesGenerator, adjectives, colors, animals, type Config  } from 'unique-names-generator';

const customConfig: Config= {
  dictionaries: [colors, adjectives, animals],
  separator: " ",
  style: 'capital'
}; // Red_Big_Donkey

export class RaceInfo{
    id: string;
    raceName: string;
    raceStatus: RaceStatus;
    startDate: Date;
    startMillis: number = -1;
    countdownEndMillis: number = -1;
    lapCount: number = 10;
    racers: Racer[] = [];

    constructor(raceStatus: RaceStatus){
        this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        this.raceStatus = raceStatus;
        this.startDate = new Date(Date.now()); 
        this.raceName = uniqueNamesGenerator(customConfig) +" "+RaceStatus[raceStatus];
    }
}