import { SensorSettings } from "$lib/_types/sensorSettings";
import { connectedSensorIP, sensorSetting } from "$lib/stores/serverStatus";

const settingsName = "SensorSettings";
const savedIp = "SavedSensorIp";

export function getSavedSensorSettings(){
    let localSettings = localStorage.getItem(settingsName);
    if (localSettings != null || localSettings != "") {
        sensorSetting.set(JSON.parse(localSettings as string) as SensorSettings);
    } else {
        sensorSetting.set(new SensorSettings());
    }
}

export function saveSensorSettings(settings:string){
    localStorage.setItem(settingsName,settings);
}

export function getSavedSensorIp(){
    let foundIp = localStorage.getItem(savedIp);
    if (foundIp != null || foundIp != "") {
        connectedSensorIP.set(foundIp as string);
    }
}

export function saveSensorIp(ip:string){
    connectedSensorIP.set(ip);
    localStorage.setItem(savedIp, ip);
}