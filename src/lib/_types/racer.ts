export default class Racer{
    id: number = -1
    name: string = ""
    startTime: number = -1
    lapTimes: number[] = []
    color: string = "#00FFFFFF"

    constructor(id: number){
        this.id = id;
        this.name = id+ "_slot"
    }
}