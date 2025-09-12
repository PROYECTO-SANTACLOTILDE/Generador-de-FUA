import { Field } from "multer";
import BaseFieldFormEntity, { BaseFieldFormEntityInterface } from "./BaseFieldFormEntity";
import { z } from "zod";
import {FUAFieldSchema} from "./FUAField";

export interface FUASectionInterface extends BaseFieldFormEntityInterface{
    top: number;
    left: number;
    bodyHeight: number;
    bodyWidth: number;
    titleHeight?: number;
    title?: string;
    showTitle?: boolean;
    fields: Array<any>;
    extraStyles?: string;
};

export const FUASectionSchema = z.object({
    top: z.number(),
    left: z.number(),
    bodyHeight: z.number(),
    bodyWidth: z.number(),
    titleHeight: z.number().optional(),
    title: z.string().optional(),
    showTitle: z.boolean().optional(),
    fields: z.array(FUAFieldSchema),
    extraStyles: z.string().optional(),
});



class FUASection extends BaseFieldFormEntity {
    
    top: number;
    left: number;
    bodyHeight: number;
    bodyWidth: number;
    titleHeight?: number;
    title?: string;
    showTitle?: boolean;
    fields: Array<any>;
    extraStyles?: string;

    constructor(aux: FUASectionInterface) {
        const result = FUASectionSchema.safeParse(aux);
        if (!result.success) {
            const newError = new Error('Error in FUA Section (object) - Invalid FUASectionInterface - constructor');
            (newError as any).details = result.error;
            throw newError;
        }
        super(aux);
        this.top = aux.top;
        this.left = aux.left;
        this.bodyHeight = aux.bodyHeight;
        this.bodyWidth = aux.bodyWidth;
        this.titleHeight = aux.titleHeight;
        this.title = aux.title;
        this.showTitle = aux.showTitle;
        this.fields = aux.fields;
        this.extraStyles = aux.extraStyles;
    }


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
    
    get getFields() { return this.fields; }
    set setFields(value: Array<any>) { this.fields = value; }

    get getExtraStyles() { return this.extraStyles; }
    set setExtraStyles(value: string | undefined) { this.extraStyles = value; }
}

export default FUASection;