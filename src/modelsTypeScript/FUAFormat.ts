import BaseFieldFormEntity, { BaseFieldFormEntityInterface } from "./BaseFieldFormEntity";
import FUAPage from "./FUAPage";

interface FUAFormatInterface extends BaseFieldFormEntityInterface{
    name: string;
    pages?: Array<FUAPage>;
};


class FUAFormat extends BaseFieldFormEntity {
    name: string;
    pages: Array<FUAPage>;


    constructor(aux: FUAFormatInterface) {
        super(aux);
        this.name = aux.name;
        this.pages = aux.pages ?? new Array<FUAPage>();
    }

    get getName() { return this.name; }
    set setName(value: string) { this.name = value; }

    get getPages() { return this.pages; }
    set setPages(value: Array<FUAPage>) { this.pages = value; }
}

export default FUAFormat;