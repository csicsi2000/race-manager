// dbRacer is connected
export default class Racer{
    raceId: number = -1
    name: string = ""
    startTime: number = -1
    lapTimes: number[] = []
    color: string = "#00FFFFFF"

    constructor(raceId: number, name: string){
        this.raceId = raceId;
        this.name = name;
    }
}