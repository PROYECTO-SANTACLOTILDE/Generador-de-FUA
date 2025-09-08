import { Field } from "multer";
import BaseFieldFormEntity, { BaseFieldFormEntityInterface } from "./BaseFieldFormEntity";

export interface FUASectionInterface extends BaseFieldFormEntityInterface{
    sectionIndex: number;
    top: number;
    left: number;
    bodyHeight: number;
    bodyWidth: number;
    titleHeight?: number;
    title?: string;
    showTitle?: boolean;
    prefix: string;
    printMode: boolean;
    fields: Array<any>;
    extraStyles?: string;
};



class FUASection extends BaseFieldFormEntity {
    
    sectionIndex: number;
    top: number;
    left: number;
    bodyHeight: number;
    bodyWidth: number;
    titleHeight?: number;
    title?: string;
    showTitle?: boolean;
    prefix: string;
    printMode: boolean;
    fields: Array<any>;
    extraStyles?: string;

    constructor(aux: FUASectionInterface) {
        super(aux);
        this.sectionIndex = aux.sectionIndex;
        this.top = aux.top;
        this.left = aux.left;
        this.bodyHeight = aux.bodyHeight;
        this.bodyWidth = aux.bodyWidth;
        this.titleHeight = aux.titleHeight;
        this.title = aux.title;
        this.showTitle = aux.showTitle;
        this.prefix = aux.prefix;
        this.printMode = aux.printMode;
        this.fields = aux.fields;
        this.extraStyles = aux.extraStyles;

    }

    get getSectionIndex() { return this.sectionIndex; }
    set setSectionIndex(value: number) { this.sectionIndex = value; }

    get getTop() { return this.top; }
    set setTop(value: number) { this.top = value; }

    get getLeft() { return this.left; }
    set setLeft(value: number) { this.left = value; }

    get getBodyHeight() { return this.bodyHeight; }
    set setBodyHeight(value: number) { this.bodyHeight = value; }

    get getBodyWidth() { return this.bodyWidth; }
    set setBodyWidth(value: number) { this.bodyWidth = value; }

    get getTitleHeight() { return this.titleHeight; }
    set setTitleHeight(value: number | undefined) { this.titleHeight = value; }

    get getTitle() { return this.title; }
    set setTitle(value: string | undefined) { this.title = value; }

    get getShowTitle() { return this.showTitle; }
    set setShowTitle(value: boolean | undefined) { this.showTitle = value; }

    get getPrefix() { return this.prefix; }
    set setPrefix(value: string) { this.prefix = value; }

    get getPrintMode() { return this.printMode; }
    set setPrintMode(value: boolean) { this.printMode = value; }

    get getFields() { return this.fields; }
    set setFields(value: Array<any>) { this.fields = value; }

    get getExtraStyles() { return this.extraStyles; }
    set setExtraStyles(value: string | undefined) { this.extraStyles = value; }
}

export default FUASection;