import BaseFieldFormEntity, { BaseFieldFormEntityInterface } from "./BaseFieldFormEntity";

interface FUAFormatInterface extends BaseFieldFormEntityInterface{
    name: string;
};


class FUAFormat extends BaseFieldFormEntity {
    name: string;

    constructor(aux: FUAFormatInterface) {
        super(aux);
        this.name = aux.name;
    }

    get getName() { return this.name; }
    set setName(value: string) { this.name = value; }
}

export default FUAFormat;