import type { IRaceInfo } from '$lib/_types/interfaces/IRaceInfo';
import { writable } from 'svelte/store';

export const raceHistory = writable<IRaceInfo[]>([]);