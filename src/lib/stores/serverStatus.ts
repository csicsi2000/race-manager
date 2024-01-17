import { ConnectionStatus } from '$lib/_types/enums/connectionStatus';
import { SensorData } from '$lib/_types/sensorData';
import { SensorSettings } from '$lib/_types/sensorSettings';
import { writable } from 'svelte/store'

export const connection = writable(ConnectionStatus.DISCONNECTED);

export const connectedIP = writable<string>("");

export const sensorReadings = writable(new SensorData());

export const sensorSetting = writable(new SensorSettings());