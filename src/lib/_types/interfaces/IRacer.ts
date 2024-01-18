
export interface IRacer{
    raceId: number;
    name: string;
    startMillis: number;
    bestLapTime: number;
    lapTimes: number[];
    color: string ;
    jumpStart: number;
}