import { RaceStatus } from '$lib/_types/enums/raceStatus'
import type { IRaceInfo } from '$lib/_types/interfaces/IRaceInfo';
import { RaceInfo } from '$lib/_types/raceInfo'
import { writable } from 'svelte/store'

export const currentRaceInfo = writable<IRaceInfo>(new RaceInfo(RaceStatus.PRACTICE));

export const sessionStatus = writable(RaceStatus.PRACTICE);

export const newRaceInfo = writable<IRaceInfo>(new RaceInfo(RaceStatus.RACE));

export const isFirstRun = writable(true);