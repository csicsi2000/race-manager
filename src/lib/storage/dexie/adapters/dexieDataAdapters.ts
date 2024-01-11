import { DbRaceInfo } from "../adapterData/dbRaceInfo";
import { RaceStatus } from "$lib/_types/enums/raceStatus";
import { RaceInfo } from "$lib/_types/raceInfo";
import type Dexie from "dexie";
import { DbRacer } from "../adapterData/dbRacer";

const delimeter = ";";

export class DexiaDataAdapters{
    db: Dexie;

    constructor(db :Dexie){
        this.db = db;
    }

    saveRaceInfo(raceInfo : RaceInfo){
        let dbRaceInfo = new DbRaceInfo();

        this.db.table("racers").where("raceId").equals(raceInfo.id).delete();

        dbRaceInfo.id = raceInfo.id;
        dbRaceInfo.raceStatus = RaceStatus[raceInfo.raceStatus];
        dbRaceInfo.startMillis = raceInfo.startMillis;
        dbRaceInfo.countdownMillis = raceInfo.countdownEndMillis;
        dbRaceInfo.startDate = raceInfo.startDate.toISOString();

        this.db.table("raceInfo").put(dbRaceInfo);

        raceInfo.racers.forEach(x => {
            let dbRacer = new DbRacer();
            dbRacer.raceId = dbRaceInfo.id;
            dbRacer.color = x.color;
            dbRacer.name = x.name;
            dbRacer.startTime = x.startTime;
            dbRacer.lapTimes = x.lapTimes.join(delimeter);

            this.db.table("racers").add(dbRacer);
        })

        return dbRaceInfo;
    }
/*
    getRaceInfos():RaceInfo[]{
        let raceInfo = new RaceInfo(RaceStatus[this.raceStatus as keyof typeof RaceStatus]);
        
        let dbrInfos = this.db.table("raceInfo").mapToClass(DbRaceInfo);
        
        return raceInfo;
    }
*/
    dbToRaceInfo(dbRaceInfo: DbRaceInfo):RaceInfo{
        let raceInfo = new RaceInfo(RaceStatus[dbRaceInfo.raceStatus as keyof typeof RaceStatus]);
        raceInfo.id = dbRaceInfo.id;
        raceInfo.countdownEndMillis = dbRaceInfo.countdownMillis;
        raceInfo.startDate = new Date(dbRaceInfo.startDate);
        raceInfo.startMillis = dbRaceInfo.startMillis;

        return raceInfo;
    }
}