import { RaceStatus } from "$lib/_types/enums/raceStatus";
import type { IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
import type { RaceInfoDatabase } from "$lib/_types/interfaces/raceInfoDatabase";
import { RaceInfo } from "$lib/_types/raceInfo";

const dataName = "RaceInfoDatabase";
const config = "RaceInfoConfig";

export class LocalStorageDatabase implements RaceInfoDatabase {
    static clearAll(): boolean {
        localStorage.removeItem(config);
        localStorage.removeItem(dataName);
        return true;
    }
    
    storeRaceConfig(info: IRaceInfo): boolean {
        localStorage.setItem(config, JSON.stringify(info));
        return true;
    }

    getRaceConfig(): IRaceInfo {
        try {
            let allData = localStorage.getItem(config);
            if (allData) {
                return normalizeRaceInfo(JSON.parse(allData) as IRaceInfo);
            }
            throw new Error();
        }
        catch {
            console.log("Config get failed.");
            return new RaceInfo(RaceStatus.PRACTICE);
        }
    }

    readonly eventName = "raceHistoryChanged";
    private event = new Event(this.eventName);

    setAllRaceInfos(allInfos: IRaceInfo[]): boolean {
        try {
            localStorage.setItem(dataName, JSON.stringify(allInfos));
            document.dispatchEvent(this.event);
            console.log("RaceHistory set.")
            return true
        }
        catch {
            console.log("All RaceHistory set failed.")
            return false;
        }
    }

    getRaceInfos(): IRaceInfo[] {
        try {
            let allData = localStorage.getItem(dataName);
            if (allData) {
                return (JSON.parse(allData) as IRaceInfo[]).map(normalizeRaceInfo);
            }
            throw new Error();
        }
        catch {
            return [];
        }
    }

    putRaceInfo(raceInfo: IRaceInfo): boolean {
        try {
            let allInfos = this.getRaceInfos();
            let existingItem = allInfos.find(x => x.id == raceInfo.id);
            if (existingItem == undefined) {
                allInfos.push(raceInfo);
            } else {
                let index = allInfos.indexOf(existingItem);
                allInfos[index] = raceInfo;
                this.setAllRaceInfos(allInfos);
            }
            return true;
        } catch {
            console.error("Raceinfo adding failed");
            return false;
        }
    }

    deleteRaceInfo(id: string): boolean {
        try {
            let allInfos = this.getRaceInfos();
            let existingItem = allInfos.find(x => x.id == id);
            if (existingItem == undefined) {
                return true;
            } else {
                let index = allInfos.indexOf(existingItem);
                allInfos.splice(index, 1);
                this.setAllRaceInfos(allInfos);
                return true;
            }
        } catch {
            console.error("Raceinfo deletion failed;");
            return false;
        }
    }

}

function normalizeRaceInfo(info: IRaceInfo): IRaceInfo {
    return {
        ...new RaceInfo(info.raceStatus ?? RaceStatus.PRACTICE),
        ...info,
        startDate: info.startDate ? new Date(info.startDate) : new Date(),
        startMillis: Number.isFinite(Number(info.startMillis)) ? Number(info.startMillis) : -1,
        countdownEndMillis: Number.isFinite(Number(info.countdownEndMillis)) ? Number(info.countdownEndMillis) : -1,
        lapCount: Number.isFinite(Number(info.lapCount)) ? Number(info.lapCount) : 10,
        racers: info.racers ?? []
    };
}
