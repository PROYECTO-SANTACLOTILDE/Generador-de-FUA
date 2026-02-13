import { Field } from "multer";
import BaseFieldFormEntity, { BaseFieldFormEntityInterface } from "./BaseFieldFormEntity";
import { z } from "zod";
import FUAField, {FUAField_Box, FUAField_Field, FUAField_Table, FUAFieldSchema} from "./FUAField";
import { FUAPageInterface } from "./FUAPage";

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
    fields: z.array(z.any()),
    extraStyles: z.string().optional(),
});



class FUASection extends BaseFieldFormEntity {
    
    top: number;
    left: number;
    bodyHeight: number;
    bodyWidth: number;
    titleHeight?: number;
    title?: string;
    showTitle: boolean;
    fields: Array<any>;
    extraStyles?: string;

    constructor(aux: FUASectionInterface, index?: number) {
        const result = FUASectionSchema.safeParse(aux);
        if (!result.success) {
            const newError = new Error(`Error in FUA Section (constructor) - Invalid FUASectionInterface - constructor`);
            (newError as any).details = result.error;
            throw newError;
        }
        super(aux);
        this.top = aux.top;
        this.left = aux.left;
        this.bodyHeight = aux.bodyHeight;
        this.bodyWidth = aux.bodyWidth;
        this.showTitle = aux.showTitle ?? false;
        // Validate title related fields
        if(aux.showTitle === true){
            const checkingTitleHeight = typeof(aux.titleHeight);
            if(checkingTitleHeight !== 'number') throw new Error('Attribute titleHeight is not number when showTitle is true. '); 
            this.titleHeight = aux.titleHeight;
        
            const checkingTitle = typeof(aux.title);
            if(checkingTitle !== 'string') throw new Error('Attribute title is not string when showTitle is true. '); 
            this.title = aux.title;
        } 
        this.fields = new Array<FUAField_Field | FUAField_Box | FUAField_Table>();
        this.extraStyles = aux.extraStyles;
        // Build the sons objects
        if(aux.fields){
            // We assume is an array            
            for( let i = 0; i < aux.fields.length; i++){
                try{
                    const auxNewField = FUAField.buildFUAField(aux.fields[i], i );
                    this.fields.push(auxNewField);
                }catch(error: unknown){
                    console.error(`Error in FUASection constructor (section: ${index} - field: ${i}) - creatingFields: `, error);
                    (error as Error).message =  `Error in FUASection constructor (section: ${index} - field: ${i}) - creatingFields: ` + (error as Error).message;
                    throw error;
                }
                
            }            
        }
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
    set setShowTitle(value: boolean ) { this.showTitle = value; }
    
    get getFields() { return this.fields; }
    set setFields(value: Array<any>) { this.fields = value; }

    get getExtraStyles() { return this.extraStyles; }
    set setExtraStyles(value: string | undefined) { this.extraStyles = value; }
}

export default FUASection;