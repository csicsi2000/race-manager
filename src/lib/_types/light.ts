import { LightColors } from "./enums/lightColors";

export default class Light{
    id: number = 0
    color: LightColors = LightColors.off

    constructor(id: number){
        this.id = id;
    }
}

