import { Field } from "multer";
import BaseFieldFormEntity, { BaseFieldFormEntityInterface } from "./BaseFieldFormEntity";
import FUARenderingUtils from "../utils/FUARendering";
import {z} from "zod";

export interface FUAFieldInterface extends BaseFieldFormEntityInterface{
    top: number;
    left: number;
    width: number;
    height: number;
    extraStyles?: string;
    showLabel: boolean;
    labelHeight?: number;
    labelWidth?: number;
    label: string;
    labelPosition?: string;
    labelExtraStyles?: string;
    valueType: string; //
    //columns: number; //
    //fields: Array<Field>; //
};

export const FUAFieldSchema = z.object({
  top: z.number(),
  left: z.number(),
  width: z.number(),
  height: z.number(),
  extraStyles: z.string().optional(),
  showLabel: z.boolean(),
  labelHeight: z.number().optional(),
  label: z.string().optional(),
  labelPosition: z.string().optional(),
  labelExtraStyles: z.string().optional(),
  valueType: z.string(),
});



interface FUAField_TableInterface extends FUAFieldInterface {
    valueType: "Table";
    columns: Array<any>;
    rows: Array<any>;
};

interface FUAField_BoxInterface extends FUAFieldInterface {
    valueType: "Box";
    text: string;
};

interface FUAField_FieldInterface extends FUAFieldInterface {
    valueType: "Field";
    fields: Array<FUAField_Field | FUAField_Box | FUAField_Table>; 
};

export const FUAFieldTableSchema = FUAFieldSchema.extend({
    valueType: z.literal("Table"),
    columns: z.array(z.any()),
    rows: z.array(z.any()),
});

export const FUAFieldBoxSchema = FUAFieldSchema.extend({
    valueType: z.literal("Box"),
    text: z.string(),
});

export const FUAFieldFieldSchema = FUAFieldSchema.extend({
    valueType: z.literal("Field"),
    fields: z.array(z.any())
});


function tablerenderer_row( auxRow : any, index : number, colAmount : number, prefix: string, printMode : boolean) : string {
    let htmlContent = '';
    // no columns, return ''
    if( colAmount === 0 ) return '';
    
    // Row height
    let height = `style="height: ${auxRow.height}mm;"`;

    // Get cell if the are
    let cells = auxRow.cells ?? null;
    let rowContent = [];
    for(let i = 0; i < colAmount; i++ ){
        let extraStyles = '';
        if( cells !== null){
            extraStyles = `
            <style>
                #${prefix}-row-${index}-cell-${i} {
                    ${cells?.[i]?.extraStyles ?? ''},
                    min-width: 0;
                }
            </style>
            `;
        }
        let auxCellContent = `
            ${extraStyles}
            <td id="${prefix}-row-${index}-cell-${i}" class="field-border text-container ${printMode ? 'format-related-print' : ''}" > 
                ${cells?.[i]?.text ?? ''} 
            </td>
        `;
        rowContent.push(auxCellContent);
    }

    htmlContent = `
        <tr ${height} class="field-border ${printMode ? 'format-related-print' : ''}">
            ${rowContent.length > 0 ? rowContent.join('') : ''}
        </tr>
    `;

    return htmlContent;
};


function fieldRenderer(field: FUAField, fieldIndex: number, prefix: string, printMode: boolean) : string {
    // ...field rendering logic...
    return "<!-- Field HTML -->";
};



/*

Table, Box, Field

FUAField -> box, table, etc

FueField -> string

if FUAField.valueType == box
    renderbox
if FUAField.valueType == table
    renderTable
if FUAField.valueType == etc
    renderetc

renderTypeField
    FuaField ? box -> FUAFieldBox.render
    FuaField ? table -> FUAFieldTable.render
    FuaField ? etc -> FUAFieldEtc.render

renderTypeField(FUAField).render

*/


/*
    FINAL DESIRED FLOW
    FUAFIELD .renderContent
        const a = .label (renderLabel)
        const b = .extraStyles (renderExtraStyles)
        const c = .content (with dependency) (render)
        return a + b + c (string)
*/

//const aux = new FUAField();

export abstract class FUAField extends BaseFieldFormEntity  {
    // Label attributes
    top: number;
    left: number;
    width: number;
    height: number;
    extraStyles?: string; // <- stated by .json.c file, we cant touch them
    showLabel: boolean;
    labelWidth?: number;
    labelHeight?: number;
    label: string;
    labelPosition?: string;
    labelExtraStyles?: string;
    valueType: string;    

    constructor(aux: FUAFieldInterface) {
        const result = FUAFieldSchema.safeParse(aux);
        if (!result.success) {
            const newError = new Error('Error in FUA Field (object) - Invalid FUAFieldIterface - constructor');
            (newError as any).details = result.error;
            throw newError;
        }
        
        super(aux);
        this.top = aux.top;
        this.left = aux.left;
        this.width = aux.width;
        this.height = aux.height;
        this.extraStyles = aux.extraStyles;
        this.showLabel = aux.showLabel;
        this.labelWidth = aux.labelWidth;
        this.labelHeight = aux.labelHeight;
        this.label = aux.label;
        this.labelPosition = aux.labelPosition;
        this.labelExtraStyles = aux.labelExtraStyles;
        this.valueType = aux.valueType;
    }

    get getTop() { return this.top; }
    set setTop(value: number) { this.top = value; }

    get getLeft() { return this.left; }
    set setLeft(value: number) { this.left = value; }

    get getWidth() { return this.width; }
    set setWidth(value: number) { this.width = value; }

    get getHeight() { return this.height; }
    set setHeight(value: number) { this.height = value; }

    get getExtrasStyles() { return this.extraStyles; }
    set setExtrasStyles(value: string | undefined) { this.extraStyles = value; }

    get getShowLabel() { return this.showLabel; }
    set setShowLabel(value: boolean) { this.showLabel = value; }

    get getLabelHeight() { return this.labelHeight; }
    set setLabelHeight(value: number) { this.labelHeight = value; }

    get getLabelWidth() { return this.labelWidth; }
    set setLabelWidth(value: number) { this.labelWidth = value; }

    get getLabel() { return this.label; }
    set setLabel(value: string) { this.label = value; }

    get getlabelPosition() { return this.labelPosition; }
    set setlabelPosition(value: string | undefined) { this.labelPosition = value; }

    get getLabelExtraStyles() { return this.labelExtraStyles; }
    set setLabelExtraStyles(value: string | undefined) { this.labelExtraStyles = value; }

    get getValueType() { return this.valueType; }
    set setValueType(value: string) { this.valueType = value; }

    // Common methods
    renderLabel(prefix : string, printMode : boolean, fieldIndex : number) : string {
        
        return FUARenderingUtils.renderFUAFieldFromSchema_renderLabel(this, prefix, printMode, fieldIndex);
    }

    renderContent(fieldIndex: number, prefix: string, printMode : boolean, label : string) : string {        
        let logicAditionalStyles = { value: '' };
        let fieldContent = this.render(fieldIndex, prefix, printMode, logicAditionalStyles)
        let labelContent = this.renderLabel(prefix, printMode, fieldIndex);
        
        let finalContent = ``;
        
        finalContent = `
            <style>
                #${prefix}-field-${fieldIndex} {
                    top:    ${this.top.toFixed(1)}mm;
                    left:   ${this.left.toFixed(1)}mm;
                    ${this.extraStyles} 
                    ${logicAditionalStyles.value} 
                }
            </style>
            <table id="${prefix}-field-${fieldIndex}" class="table-field ${printMode ? 'format-related-print' : ''}" >
                ${labelContent}
                ${fieldContent}
            </table>
        `;
        return finalContent;
    }



    // Overwrite methods
    abstract render(fieldIndex: number, prefix: string, printMode: boolean, logicAditionalStyles : { value: string; }): string;
    
    static buildFUAField( newField : any ) : FUAField_Field | FUAField_Box | FUAField_Table | null {
        switch(newField.valueType){
            case "Table":
                return new FUAField_Table(newField as FUAField_TableInterface);
                break;
            case "Box":
                return new FUAField_Box(newField as FUAField_BoxInterface);
                break;
            case "Field":
                return new FUAField_Field(newField as FUAField_FieldInterface);
                break;
            default:
                return null;
                break;
        }
    }
}

export class FUAField_Box extends FUAField {

    //private valueType: "Box";
    private text: string;

    constructor(aux: FUAField_BoxInterface) {
        const result = FUAFieldBoxSchema.safeParse(aux);
        if (!result.success) {
            const newError = new Error('Error in FUA Field (object) - Invalid FUAFieldBoxInterface - constructor');
            (newError as any).details = result.error;
            throw newError;
        }
        super(aux as FUAFieldInterface);
        this.valueType = aux.valueType;
        this.text = aux.text;
    }

    get getText(): string {
        return this.text;
    }
    set setText(value: string) {
        this.text = value;
    }

    //Overriden method
    render(fieldIndex: number, prefix: string, printMode: boolean, logicAditionalStyles : { value: string; }): string {
        // Dont forget to add width in logicAditionalStyles
        let fieldContent = `
            <tr>
                <td class="text-container ${printMode ? 'format-related-print' : ''}"> ${this.text ?? ''} <td>
            </tr>
        `;
        logicAditionalStyles.value += `
            width:  ${this.width.toFixed(1)}mm;    
            height: ${this.height.toFixed(1)}mm;  
        `;
        return fieldContent;
    }
}

export class FUAField_Table extends FUAField {

    // Special Attributes
    // valueType is "Table"
    private columns: Array<any>;
    private rows: Array<any>;

    // Constructor
    constructor(aux: FUAField_TableInterface) {
        (aux as FUAFieldInterface).width = 0.0;
        (aux as FUAFieldInterface).height = 0.0;
        const result = FUAFieldTableSchema.safeParse(aux);
        if (!result.success) {
            const newError = new Error('Error in FUA Field (object) - Invalid FUAFieldTableInterface - constructor');
            (newError as any).details = result.error;
            throw newError;
        }
        super(aux as FUAFieldInterface);
        this.columns = aux.columns;
        this.rows = aux.rows;
        
    }

    // Methods
    get getColumns(): any {
        return this.columns;
    }

    set setColumns(value: any){
        this.columns = value;
    }

    //Overriden method
    render(fieldIndex: number, prefix: string, printMode: boolean, logicAditionalStyles : { value: string; }): string {        
        let auxWidthValue = 0.0;
        // Define colgroups
        let auxColumns = this.columns.map((item: any) => `<col style="width: ${item.width.toFixed(1)}mm;" />` );          
        let colgroups  = `
            <colgroup>
                ${auxColumns.join('')}
            </colgroup>
        `;
        auxWidthValue = this.columns.reduce((auxWidthValue: number, obj: any) => auxWidthValue + parseFloat(obj.float || 0), 0);
        logicAditionalStyles.value += `
            width: ${auxWidthValue.toFixed(1)}mm; 
        `;

        // Defining rows, ordered by 'index' attribute
        let auxRows = this.rows.sort( (a: any, b: any) => ( a.index - b.index ) );
        // Process row renderFUAFieldTableRowFromSchema
        auxRows = auxRows.map( (row: any, index: number) => tablerenderer_row(row, index, auxColumns.length ,`${prefix}-field-${fieldIndex}`, printMode) );
        
        return colgroups + auxRows.join('');      
    }
}





export class FUAField_Field extends FUAField {

    private fields: Array<FUAField_Field | FUAField_Box | FUAField_Table>; 

    constructor(aux: FUAField_FieldInterface) {
        const result = FUAFieldFieldSchema.safeParse(aux);
        if (!result.success) {
            const newError = new Error('Error in FUA Field (object) - Invalid FUAFieldFieldInterface - constructor');
            (newError as any).details = result.error;
            throw newError;
        }
        super(aux as FUAFieldInterface);
        this.fields = new Array<FUAField_Field | FUAField_Box | FUAField_Table>
        // Build the children objects
        if(aux.fields){
            // We assume is an array            
            for( const auxField of aux.fields){
                const auxNewField = FUAField.buildFUAField(auxField);
                if(auxNewField === null) throw new Error('Invalid value type. ');
                this.fields.push(auxNewField);
            }            
        }
    }
    
    get getFields(): Array<FUAField_Field | FUAField_Box | FUAField_Table> {
        return this.fields;
    }
    set setFields(value: Array<FUAField_Field | FUAField_Box | FUAField_Table>) {
        this.fields = value;   
    }

    //Overriden method
    render(fieldIndex: number, prefix: string, printMode: boolean, logicAditionalStyles : { value: string; }): string {
        let auxFields = this.fields;
            let fieldContent = auxFields.map( (item: any, index: number) => item.render(index, `${prefix}-field-${fieldIndex}`, printMode, logicAditionalStyles) ).join('');
            logicAditionalStyles.value += `
            width:  ${this.width.toFixed(1)}mm; 
            height: ${this.height.toFixed(1)}mm;  
            `;
            
            fieldContent = `
                <tr>
                    <td style="padding: 0px;" class="field-content ${printMode ? 'format-related-print' : ''}"> 

                            ${fieldContent}

                    <td>
                </tr>
            `;
        return fieldContent;
    }
}

export default FUAField;