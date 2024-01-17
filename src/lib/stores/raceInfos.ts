import { RaceStatus } from '$lib/_types/enums/raceStatus'
import type { IRaceInfo } from '$lib/_types/interfaces/IRaceInfo';
import { RaceInfo } from '$lib/_types/raceInfo'
import { writable } from 'svelte/store'

export const currentPractice = writable<IRaceInfo>(new RaceInfo(RaceStatus.PRACTICE));

// Current race
export const currentRace = writable<IRaceInfo | null>(null);

export const sessionStatus = writable(RaceStatus.PRACTICE);

// Configured session. New sessions are created based on this
export const newRaceInfo = writable<IRaceInfo>(new RaceInfo(RaceStatus.RACE));