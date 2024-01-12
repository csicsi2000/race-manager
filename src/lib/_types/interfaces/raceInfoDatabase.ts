import type { RaceInfo } from "../raceInfo";

export interface RaceInfoDatabase{
    setAllRaceInfos(allInfos:RaceInfo[]):boolean;
    getRaceInfos():RaceInfo[];
    putRaceInfo(raceInfo:RaceInfo):boolean;
    deleteRaceInfo(id:string):boolean;

    storeRaceConfig(info: RaceInfo):boolean;
    getRaceConfig():RaceInfo;

    readonly eventName: string;
}