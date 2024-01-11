import Dexie from 'dexie';
import { RaceInfo } from '$lib/_types/raceInfo';
import type { DbRaceInfo } from './adapterData/dbRaceInfo';
import { DbRacer } from './adapterData/dbRacer';

// Define the Dexie database
class RacingDatabase extends Dexie {
  racers: Dexie.Table<DbRacer, number>;
  raceInfo: Dexie.Table<DbRaceInfo, number>;

  constructor() {
    super('RacingDatabase');

    // Define tables
    this.version(1).stores({
      racers: '++id,raceId, name, startTime, lapTimes, color',
      raceInfo: '++id, raceStatus, startTime, countdownTime, racers',
    });

    // Point to the tables
    this.racers = this.table("racer")
    this.raceInfo = this.table('raceInfo');
 
    
  }
}

// Instantiate the database
const racingDB = new RacingDatabase();