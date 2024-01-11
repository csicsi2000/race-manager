import type { RaceInfoDatabase } from '$lib/_types/interfaces/raceInfoDatabase';
import { LocalStorageDatabase } from '$lib/storage/localstorage/localStorageDatabase';
import { raceHistory } from '$lib/stores/raceHistory';
import type { PageLoad } from './$types';

export const load = (async () => {
    let raceHistoryDatabase: RaceInfoDatabase = new LocalStorageDatabase();

    raceHistory.set(raceHistoryDatabase.getRaceInfos());

    document.addEventListener(raceHistoryDatabase.eventName,() =>{
        raceHistory.set(raceHistoryDatabase.getRaceInfos());
    })
    
    return {};
}) satisfies PageLoad;