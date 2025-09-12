
import BaseFieldFormEntity, { BaseFieldFormEntityInterface } from "./BaseFieldFormEntity";
import { z } from "zod";
import FUASection from "./FUASection";
import {FUASectionSchema} from "./FUASection";


export interface FUAPageInterface extends BaseFieldFormEntityInterface{
    pageNumber: number;
    height: number;
    width: number;
    padding_top?: number;
    padding_left?: number;
    extraStyles?: string; 
    sections: Array<FUASection>;
};

export const FUAPageSchema = z.object({
    pageNumber: z.number(),
    height: z.number(),
    width: z.number(),
    padding_top: z.number().optional(),
    padding_left: z.number().optional(),
    extraStyles: z.string().optional(),
    sections: z.array(FUASectionSchema), 
});




class FUAPage extends BaseFieldFormEntity {
    pageNumber: number;
    height: number;
    width: number;
    padding_top: number;
    padding_left: number;
    extraStyles?: string;
    sections: Array<FUASection>;

    constructor(aux: FUAPageInterface) {
        const result = FUAPageSchema.safeParse(aux);
        if (!result.success) {
            const newError = new Error('Error in FUA Page (object) - Invalid FUAPageInterface - constructor');
            (newError as any).details = result.error;
            throw newError;
        }
        super(aux);
        this.pageNumber = aux.pageNumber;
        this.height = aux.height;
        this.width = aux.width;
        this.extraStyles = aux.extraStyles;
        this.padding_top = aux.padding_top ?? 0;
        this.padding_left = aux.padding_left ?? 0;
        this.sections = aux.sections;
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

    get getSections() { return this.sections; }
    set setSections(value: Array<FUASection>) { this.sections = value; }
}

export default FUAPage;