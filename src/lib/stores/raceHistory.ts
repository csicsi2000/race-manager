import { RaceInfo } from '$lib/_types/raceInfo';
import { LocalStorageDatabase } from '$lib/storage/localstorage/localStorageDatabase';
import { writable } from 'svelte/store';

export const raceHistory = writable<RaceInfo[]>([]);
