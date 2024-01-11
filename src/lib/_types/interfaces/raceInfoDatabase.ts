import type { RaceInfo } from "../raceInfo";

export interface RaceInfoDatabase{
    setAllRaceInfos(allInfos:RaceInfo[]):boolean;
    getRaceInfos():RaceInfo[];
    putRaceInfo(raceInfo:RaceInfo):boolean;
    deleteRaceInfo(id:string):boolean;

    readonly eventName: string;
}