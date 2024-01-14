import type { IRaceInfo } from "./IRaceInfo";

export interface RaceInfoDatabase{
    setAllRaceInfos(allInfos:IRaceInfo[]):boolean;
    getRaceInfos():IRaceInfo[];
    putRaceInfo(raceInfo:IRaceInfo):boolean;
    deleteRaceInfo(id:string):boolean;

    storeRaceConfig(info: IRaceInfo):boolean;
    getRaceConfig():IRaceInfo;

    readonly eventName: string;
}