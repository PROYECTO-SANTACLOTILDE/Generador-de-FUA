import BaseFieldFormEntity, { BaseFieldFormEntityInterface } from "./BaseFieldFormEntity";

export interface FUAPageInterface extends BaseFieldFormEntityInterface{
    pageNumber: number;
    height: number;
    width: number;
    extraStyle?: string; 
};



class FUAPage extends BaseFieldFormEntity {
    pageNumber: number;
    height: number;
    width: number;
    extraStyle?: string;

    constructor(aux: FUAPageInterface) {
        super(aux);
        this.pageNumber = aux.pageNumber;
        this.height = aux.height;
        this.width = aux.width;
        this.extraStyle = aux.extraStyle;
    }

    get getPageNumber() { return this.pageNumber; }
    set setPageNumber(value: number) { this.pageNumber = value; }

    get getHeight() { return this.height; }
    set setHeight(value: number) { this.height = value; }

    get getWidth() { return this.width; }
    set setWidth(value: number) { this.width = value; }

    get getExtraStyle() { return this.extraStyle; }
    set setExtraStyle(value: string | undefined) { this.extraStyle = value; }
}

export default FUAPage;