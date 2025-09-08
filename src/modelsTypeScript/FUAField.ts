import { Field } from "multer";
import BaseFieldFormEntity, { BaseFieldFormEntityInterface } from "./BaseFieldFormEntity";

export interface FUAFieldInterface extends BaseFieldFormEntityInterface{
    fieldIndex: number;
    top: number;
    left: number;
    width: number;
    height: number;
    showLabel: boolean;
    labelHeight: number;
    label: string;
    captionSide?: string;
    prefix: string; 
    printMode: boolean;
    labelExtraStyles?: string;
    valueType: string; //
    //columns: number; //
    //fields: Array<Field>; //
};

export interface FUAFieldRenderer {
    field: FUAFieldBase; 
    fieldIndex: number; 
    prefix: string; 
    printMode: boolean;
};

export type FUAFieldBase = FUAField_Table | FUAField_Box ;

interface FUAField_Table extends FUAFieldInterface {
    valueType: "Table";
    columns: Array<any>;
    rows: Array<any>;
};

interface FUAField_Box extends FUAFieldInterface {
    valueType: "Box";
    text: string;
};

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

function tableRenderer (field: FUAField_Table, fieldIndex: number, prefix: string, printMode: boolean) : string {
    let auxWidthValue = 0.0;
    // Define colgroups
    let auxColumns = field.columns.map((item: any) => `<col style="width: ${item.width.toFixed(1)}mm;" />` );          
    let colgroups  = `
        <colgroup>
            ${auxColumns.join('')}
        </colgroup>
    `;
    auxWidthValue = field.columns.reduce((auxWidthValue: number, obj: any) => auxWidthValue + parseFloat(obj.float || 0), 0);
    let auxWidth = 'width: '+auxWidthValue.toFixed(1)+'mm;'
    // Defining rows, ordered by 'index' attribute
    let auxRows = field.rows.sort( (a: any, b: any) => ( a.index - b.index ) );
    // Process row renderFUAFieldTableRowFromSchema
    auxRows = auxRows.map( (row: any, index: number) => tablerenderer_row(row, index, auxColumns.length ,`${prefix}-field-${fieldIndex}`, printMode) );
    return auxRows.join('');
};

function boxRenderer (field: FUAField_Box, fieldIndex: number, prefix: string, printMode: boolean) : string {
    let fieldContent = `
                <tr>
                    <td class="text-container ${printMode ? 'format-related-print' : ''}"> ${field.text ?? ''} <td>
                </tr>
            `;
    let extraStyles = `
                width:  ${field.width.toFixed(1)}mm;    
                height: ${field.height.toFixed(1)}mm;  
            `;
    return "<!-- Box HTML -->";
};

function fieldRenderer(field: FUAField, fieldIndex: number, prefix: string, printMode: boolean) : string {
    // ...field rendering logic...
    return "<!-- Field HTML -->";
};


function FUAFieldRenderingSelector( param : FUAFieldRenderer) : string {
    if( param.field.valueType == "Table" ) return tableRenderer( param.field, param.fieldIndex, param.prefix, param.printMode );
    if( param.field.valueType == "Box" ) return boxRenderer( param.field, param.fieldIndex, param.prefix, param.printMode );
    //if( param.field.valueType == "Field" ) return fieldRenderer( param.field, param.fieldIndex, param.prefix, param.printMode );
    return '<p> Error in rendering field </p>';
}


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
    FUAFIELD .render
        const a = .label
        const b = .extraStyles
        const c = .content (with dependency)
        return a + b + c (string)
*/

class FUAField extends BaseFieldFormEntity {
    fieldIndex: number;
    top: number;
    left: number;
    width: number;
    height: number;
    showLabel: boolean;
    labelHeight: number;
    label: string;
    captionSide?: string;
    prefix: string; 
    printMode: boolean;
    labelExtraStyles?: string;
    valueType: string;

    

    constructor(aux: FUAFieldInterface) {
        super(aux);
        this.fieldIndex = aux.fieldIndex;
        this.top = aux.top;
        this.left = aux.left;
        this.width = aux.width;
        this.height = aux.height;
        this.showLabel = aux.showLabel;
        this.labelHeight = aux.labelHeight;
        this.label = aux.label;
        this.captionSide = aux.captionSide;
        this.prefix = aux.prefix;
        this.printMode = aux.printMode;
        this.labelExtraStyles = aux.labelExtraStyles;
        this.valueType = aux.valueType;
    }

    get getFieldIndex() { return this.fieldIndex; }
    set setFieldIndex(value: number) { this.fieldIndex = value; }

    get getTop() { return this.top; }
    set setTop(value: number) { this.top = value; }

    get getLeft() { return this.left; }
    set setLeft(value: number) { this.left = value; }

    get getWidth() { return this.width; }
    set setWidth(value: number) { this.width = value; }

    get getHeight() { return this.height; }
    set setHeight(value: number) { this.height = value; }

    get getShowLabel() { return this.showLabel; }
    set setShowLabel(value: boolean) { this.showLabel = value; }

    get getLabelHeight() { return this.labelHeight; }
    set setLabelHeight(value: number) { this.labelHeight = value; }

    get getLabel() { return this.label; }
    set setLabel(value: string) { this.label = value; }

    get getCaptionSide() { return this.captionSide; }
    set setCaptionSide(value: string | undefined) { this.captionSide = value; }

    get getPrefix() { return this.prefix; }
    set setPrefix(value: string) { this.prefix = value; }

    get getPrintMode() { return this.printMode; }
    set setPrintMode(value: boolean) { this.printMode = value; }

    get getLabelExtraStyles() { return this.labelExtraStyles; }
    set setLabelExtraStyles(value: string | undefined) { this.labelExtraStyles = value; }

    get getValueType() { return this.valueType; }
    set setValueType(value: string) { this.valueType = value; }

    

}

export default FUAField;