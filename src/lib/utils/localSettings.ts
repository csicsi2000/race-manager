import { SensorSettings } from "$lib/_types/sensorSettings";
import { connectedSensorIP, sensorSetting } from "$lib/stores/serverStatus";

const settingsName = "SensorSettings";
const savedIp = "SavedSensorIp";

export function getSavedSensorSettings(){
    let localSettings = localStorage.getItem(settingsName);
    if (localSettings) {
        sensorSetting.set({ ...new SensorSettings(), ...JSON.parse(localSettings) });
    } else {
        sensorSetting.set(new SensorSettings());
    }
}

export function saveSensorSettings(settings:string){
    localStorage.setItem(settingsName,settings);
}

export function getSavedSensorIp(){
    let foundIp = localStorage.getItem(savedIp);
    if (foundIp) {
        connectedSensorIP.set(foundIp as string);
    }
}

export function saveSensorIp(ip:string){
    connectedSensorIP.set(ip);
    localStorage.setItem(savedIp, ip);
}
