import { RaceStatus } from "$lib/_types/enums/raceStatus";
import type { IRaceInfo } from "$lib/_types/interfaces/IRaceInfo";
import type { RaceInfoDatabase } from "$lib/_types/interfaces/raceInfoDatabase";
import { RaceInfo } from "$lib/_types/raceInfo";
import { error } from "@sveltejs/kit";

const dataName = "RaceInfoDatabase";
const config = "RaceInfoConfig";

export class LocalStorageDatabase implements RaceInfoDatabase {
    static clearAll(): boolean {
        localStorage.setItem(config,"");
        localStorage.setItem(dataName,"");
        return true;
    }
    storeRaceConfig(info: IRaceInfo): boolean {
        localStorage.setItem(config, JSON.stringify(info));
        return true;
    }

    getRaceConfig(): IRaceInfo {
        try {
            let allData = localStorage.getItem(config);
            if (typeof allData === 'string') {
                let formatted = JSON.parse(allData) as RaceInfo;
                console.log(formatted);
                return formatted;
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
            if (typeof allData === 'string') {
                let formatted = JSON.parse(allData) as RaceInfo[];
                return formatted;
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