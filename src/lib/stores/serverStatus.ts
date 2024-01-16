import { ConnectionStatus } from '$lib/_types/enums/connectionStatus';
import { SensorData } from '$lib/_types/sensorData';
import { writable } from 'svelte/store'

export const connection = writable(ConnectionStatus.DISCONNECTED);

export const connectedIP = writable<string|null>(null);

export const sensorReadings = writable(new SensorData());