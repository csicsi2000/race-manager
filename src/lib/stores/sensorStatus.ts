import { ConnectionStatus } from '$lib/_types/enums/connectionStatus';
import { writable } from 'svelte/store'

export const connection = writable(ConnectionStatus.DISCONNECTED);

export const connectedIP = writable("");