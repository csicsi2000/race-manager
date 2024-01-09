import { RaceStatus } from '$lib/_types/enums/raceStatus'
import {RaceInfo} from '$lib/_types/raceInfo'
import { writable } from 'svelte/store'

export const raceInfo = writable(new RaceInfo(RaceStatus.PRACTICE))