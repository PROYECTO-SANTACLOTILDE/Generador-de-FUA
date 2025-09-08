import BaseFieldFormEntity, { BaseFieldFormEntityInterface } from "./BaseFieldFormEntity";

export interface FUAPageInterface extends BaseFieldFormEntityInterface{
    pageNumber: number;
    height: number;
    width: number;
    padding_top?: number;
    padding_left?: number;
    extraStyles?: string; 
};



class FUAPage extends BaseFieldFormEntity {
    pageNumber: number;
    height: number;
    width: number;
    padding_top?: number;
    padding_left?: number;
    extraStyles?: string;

    constructor(aux: FUAPageInterface) {
        super(aux);
        this.pageNumber = aux.pageNumber;
        this.height = aux.height;
        this.width = aux.width;
        this.extraStyles = aux.extraStyles;
        this.padding_top = aux.padding_top;
        this.padding_left = aux.padding_left;

    }

    get getPageNumber() { return this.pageNumber; }
    set setPageNumber(value: number) { this.pageNumber = value; }

    get getHeight() { return this.height; }
    set setHeight(value: number) { this.height = value; }

    get getWidth() { return this.width; }
    set setWidth(value: number) { this.width = value; }

    get getPaddingTop() { return this.padding_top; }
    set setPaddingTop(value: number) { this.padding_top = value; }

    get getPaddingLeft() { return this.padding_left; }
    set setPaddingLeft(value: number) { this.padding_left = value; }

    get getExtraStyle() { return this.extraStyles; }
    set setExtraStyle(value: string | undefined) { this.extraStyles = value; }
}

export default FUAPage;