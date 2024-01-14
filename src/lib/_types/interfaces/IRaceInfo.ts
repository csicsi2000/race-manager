import type { RaceStatus } from "../enums/raceStatus";
import type { IRacer } from "./IRacer";

export interface IRaceInfo{
    id: string;
    raceName: string;
    raceStatus: RaceStatus;
    startDate: Date;
    startMillis: number;
    countdownEndMillis: number;
    lapCount: number;
    racers: IRacer[];
}
