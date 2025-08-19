import * as fs from "fs";
import * as path from "path";
import dedent from 'dedent';

// Services
import FUAFieldService from "../services/FUAFieldService";
import FUAPageService from "../services/FUAPageService";
import FUASectionService from "../services/FUASectionService";
import { dedentCustom } from "./utils";
import FUAFieldColumnService from "../services/FUAFieldColumnService";
import { col } from "sequelize";



class FUARenderingUtils {
    
    // Get CSS styles from public/FUA_Previsualization.css
    private static async getCSSStyles(): Promise<string> {
        const cssFilePath = path.resolve(process.cwd(), "./src/public/FUA_Previsualization.css");
        try {
            const fuaPreviewCss = fs.readFileSync(cssFilePath, "utf-8");
            return fuaPreviewCss;
        } catch (err) {
            console.error("Error in FUA Rendering Utils - getCSSStyles: Could not read FUA_Previsualization.css from public directory. ", err);
            throw new Error("Error in FUA Rendering Utils - getCSSStyles: Could not read FUA_Previsualization.css from public directory. ");
        }
    }


    //Render a FUA Document using HTML header and body
    public static async renderFUAFormat( FUAFormat : any ) : Promise<string> {

        let formatContent = '';

        // FUAFormat.sections is at least a []
        if( FUAFormat.pages.length === 0 ){
            formatContent = `
                <div> <p>No hay paginas en este formato FUA</p> </div>
            `;
        }else{   
            let htmlPages = null;

            try {
                htmlPages = await Promise.all( FUAFormat.pages.map((item: any, index: number) => this.renderFUAPage(item, index)));
            }catch (error: any) {
                console.error('Error in FUA Rendering Utils - renderFUAFormat: ', error);
                (error as Error).message =  'Error in FUA Rendering Utils - renderFUAFormat: ' + (error as Error).message;
                throw error;
            }
            

            formatContent = ( htmlPages ? htmlPages.map( page => `
                <div class="fua-page">
                    ${ page }
                </div>
            `).join('') : '' );
        }

        // Get CSS style from public folder
        let cssStyles = '';
        try{
            cssStyles = await this.getCSSStyles();
        }catch(error: unknown){
            console.error('Error in FUA Rendering Utils - renderFUAFormat: ', error);
            (error as Error).message =  'Error in FUA Rendering Utils - renderFUAFormat: ' + (error as Error).message;
            throw error;
        }

        let htmlContent = dedentCustom(`
            <!DOCTYPE html>
            <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Previsualizacion de FUA</title>
                    <style>
                        ${cssStyles}
                    </style>
                </head>
                <body>
                    <div id="fua-render-container">
                        ${ formatContent }
                    </div>                    
                </body>
            </html>
        `);

        return htmlContent;
    }

    public static async renderFUAPage( FUAPage : any, index: number ): Promise<string> {
        
        let htmlContent = '';
        let auxPageSections: Array<any> = [];

        // Get FUA Format Sections
        try {
            auxPageSections = await FUAPageService.getFUASectionsByIdOrUUID(FUAPage.id);
        }catch(error: any){
            console.error('Error in FUA Rendering Utils - getFUASectionsByIdOrUUID: ', error);
            (error as Error).message =  'Error in FUA Rendering Utils - getFUASectionsByIdOrUUID: ' + (error as Error).message;
            throw error;
        }

        FUAPage.sections = auxPageSections;

        // FUAFormat.sections is at least a []
        if( auxPageSections.length === 0 ){
            htmlContent = `
                <div> <p>No hay secciones en este pagina FUA</p> </div>
            `;
        }else{

            let sectionsContent = null;
            try {
                sectionsContent = await Promise.all( FUAPage.sections.map( (item: any, index: number)  => this.renderFUASection(item, index)));
            }catch (error: any) {
                console.error('Error in FUA Rendering Utils - renderFUAPage: ', error);
                (error as Error).message =  'Error in FUA Rendering Utils - renderFUAPage: ' + (error as Error).message;
                throw error;
            }

            htmlContent = ( sectionsContent ? sectionsContent.join('') : '' );    
           
        }

        return htmlContent;
    }

    public static async renderFUASection( FUASection : any, sectionIndex: number ): Promise<string> {
        let auxSectionFields: Array<any> = [];

        // Get FUA Fields of FUA Section
        try {
            auxSectionFields = await FUASectionService.getFUAFieldsById(FUASection.id.toString());
        }catch(error: any){
            console.error('Error in FUA Rendering Utils - getFUASectionsByIdOrUUID: ', error);
            (error as Error).message =  'Error in FUA Rendering Utils - getFUASectionsByIdOrUUID: ' + (error as Error).message;
            throw error;
        }

        FUASection.fields = auxSectionFields;
        
        let fieldsContent: string[] = [];
        try {
            fieldsContent = await Promise.all( FUASection.fields.map( (field: any, index: number) => this.renderFUAField(field, index) ) );  
        }catch(error: any){
            console.error('Error in FUA Rendering Utils - renderFUASection: ', error);
            (error as Error).message =  'Error in FUA Rendering Utils - renderFUASection: ' + (error as Error).message;
            throw error;
        }
        
        // title, showTitle
        let title = '';
        if(FUASection.showTitle == true){
            title = `
                <tr>
                    <th class="section-header" style="height: ${FUASection.titleHeight.toFixed(1)}mm;"> ${FUASection.title ?? ''} </th>
                </tr>
            `;            
        }

        //let fieldsHtmlContent = fieldsContent.length == 0 ? `<p> No hay campos en esta seccion <p>` : fieldsContent.join('');

        let htmlContent = `
            <table id="section-${sectionIndex.toString()}" class="table-section" style="height: ${FUASection.bodyHeight.toFixed(1)}mm;">
                  
                ${title}

                <tr>                    
                    <td class="section-content">
                        ${""}
                    </td>
                </tr>                    
            </table>
        `;

        return htmlContent;
    }

    public static async renderFUAField( auxFUAField : any, index: number ): Promise<string> {
        
        return "";
    }

    
    // Render a FUA Format using HTML header and body from jsonc schema
    // Pending to validate
    public static async renderFUAFormatFromSchema( FUAFormat : any ) : Promise<string> {

        let formatContent = '';

        // Validate pages
        if( FUAFormat.pages.length === 0 ){
            formatContent = ``;
        }else{   
            formatContent = FUAFormat.pages.map((item: any, index: number) => this.renderFUAPageFromSchema(item, index+1)).join('');            
        }

        // Get CSS style from public folder
        let cssStyles = '';
        try{
            cssStyles = await this.getCSSStyles();
        }catch(error: unknown){
            console.error('Error in FUA Rendering Utils - renderFUAFormat: ', error);
            (error as Error).message =  'Error in FUA Rendering Utils - renderFUAFormat: ' + (error as Error).message;
            throw error;
        }

        let htmlContent = dedentCustom(`
            <!DOCTYPE html>
            <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Previsualizacion de FUA</title>
                    <style>
                        ${cssStyles}
                    </style>
                </head>
                <body>
                    <div id="fua-render-container">
                        ${ formatContent }
                    </div>                    
                </body>
            </html>
        `);

        return htmlContent;
    };

    // Render FUA Page from jsonc schema
    public static renderFUAPageFromSchema( auxFUAPage : any, pageIndex: number ): string {
        
        let pageContent = '';
   
        // Get FUA Format Sections
        let auxFUASections = auxFUAPage.sections;

        // Validate sections
        if( auxFUASections === undefined || auxFUASections.length === 0){
            pageContent = ``;
        }else{            
            const paddings = {
                padding_top:    auxFUAPage.padding_top,
                padding_left:   auxFUAPage.padding_left,
            };
            pageContent = auxFUASections.map( (item:any, index: number) => this.renderFUASectionFromSchema(item, index, `fua-page-${pageIndex.toString()}`,paddings)).join('');
        }

        let htmlContent = `
            <style>
                #fua-page-${pageIndex.toString()} {
                    width: ${auxFUAPage.width.toFixed(1)}mm;
                    height: ${auxFUAPage.height.toFixed(1)}mm;
                    padding-top: ${auxFUAPage.padding_top.toFixed(1)}mm;
                    padding-left: ${auxFUAPage.padding_left.toFixed(1)}mm;
                }
            </style>
            <div id="fua-page-${pageIndex.toString()}" class="fua-page" ${auxFUAPage.extraStyle !== undefined ? `style="${auxFUAPage.extraStyle}"` : ""}>
                    ${ pageContent }
            </div>
     
        `;

        return htmlContent;
    };

    // Render FUA Section from jsonc schema
    public static renderFUASectionFromSchema( auxFUASection : any, sectionIndex: number, prefix: string, paddings: any ): string {
        
        let sectionContent = '';
      
        // title, showTitle
        let title = '';
        if(auxFUASection.showTitle == true){
            title = `
                <tr>
                    <th class="section-header text-container" style="height: ${auxFUASection.titleHeight.toFixed(1)}mm;"> ${auxFUASection.title ?? ''} </th>
                </tr>
            `;            
        }

        // Get section content
        if (!Array.isArray(auxFUASection.fields) || auxFUASection.fields.length === 0) {
            sectionContent = ``;
        }else{
            sectionContent = auxFUASection.fields.map( (item: any, index: number) => this.renderFUAFieldFromSchema(item,index,`${prefix}-section-${sectionIndex.toString()}`) ).join('');
        }

        let htmlContent = `
            <style>
                #${prefix}-section-${sectionIndex.toString()} {
                    ${ Number.isFinite(auxFUASection.top)  ? `top: ${ (paddings.padding_top + auxFUASection.top ).toFixed(1)}mm;` : ''}
                    ${ Number.isFinite(auxFUASection.left) ? `left: ${ ( paddings.padding_left + auxFUASection.left ).toFixed(1)}mm;` : ''}
                    height: ${ ( auxFUASection.bodyHeight + (auxFUASection.showTitle ? auxFUASection.titleHeight : 0.0 ) ).toFixed(1)}mm;
                    width: ${ auxFUASection.bodyWidth ? `${auxFUASection.bodyWidth.toFixed(1)}mm;` : '100%;'}
                }
            </style>
            <table id="${prefix}-section-${sectionIndex.toString()}" class="table-section" >                  
                ${title}
                <tr>                    
                    <td class="section-content">
                        ${sectionContent}
                    </td>
                </tr>                    
            </table>
        `;

        return htmlContent;
    };


    //Erase the border by the position of the label
    private static eraseBorderOfFieldCaption(captionSide: string): string{
        let result = `
            border-bottom: none;
        `;

        switch(captionSide){
            case `top`:
                result = `
                    caption-side: top;
                    border-bottom: none;
                `;
                break;
            case `bottom`:
                result = `
                    caption-side: bottom;
                    border-top: none;
                `;
                break;
            default:
                break;
        }
        return result;
    }

    // Render FUA Field from jsonc schema
    public static renderFUAFieldFromSchema( auxFUAField : any, fieldIndex: number, prefix: string): string {
        let fieldContent = '';
        let extraStyles = '';
        let auxWidth = '';
        
        let label = '';
        if(auxFUAField.showLabel == true){
            label = `
                <style>
                    #${prefix}-field-${fieldIndex}-caption {
                        ${this.eraseBorderOfFieldCaption(auxFUAField.captionSide)}
                        font-weight: bold;
                        background-color: lightgray;
                        ${auxFUAField.labelHeight ? `height: ${auxFUAField.labelHeight.toFixed(1)}mm;` : ''}
                        ${auxFUAField.labelHeight ? `line-height: ${auxFUAField.labelHeight.toFixed(1)}mm;` : ''}
                        ${auxFUAField.labelExtraStyles ?? ``}
                    }
                </style>
                <caption id="${prefix}-field-${fieldIndex}-caption" class="field-border text-container">
                    ${auxFUAField.label}
                </caption>
            `;            
        }

        let colgroups = '';

        if(auxFUAField.valueType === "Table"){
            let auxWidthValue = 0.0;
            // Define colgroups
            let auxColumns = auxFUAField.columns;
            auxColumns = auxFUAField.columns.map((item: any) => `<col style="width: ${item.width.toFixed(1)}mm;" />` );      
            
            colgroups  = `
                <colgroup>
                    ${auxColumns.join('')}
                </colgroup>
            `;
            auxWidthValue = auxFUAField.columns.reduce((auxWidthValue: number, obj: any) => auxWidthValue + parseFloat(obj.float || 0), 0);
            auxWidth = 'width: '+auxWidthValue.toFixed(1)+'mm;'
            // Defining rows, ordered by 'index' attribute
            let auxRows = auxFUAField.rows.sort( (a: any, b: any) => ( a.index - b.index ) );
            // Process row
            auxRows = auxRows.map( (row: any, index: number) => this.renderFUAFieldTableRowFromSchema(row, index, auxColumns.length ,`${prefix}-field-${fieldIndex}`) );
            fieldContent = auxRows.join('');
        }

        if( auxFUAField.valueType === "Box"){
            fieldContent = `
                <tr>
                    <td class="text-container"> ${auxFUAField.text ?? ''} <td>
                </tr>
            `;
            extraStyles = `
                width:  ${auxFUAField.width.toFixed(1)}mm;    
                height: ${auxFUAField.height.toFixed(1)}mm;  
            `;
        }

        if (auxFUAField.valueType === "Field"){
            let auxFields = auxFUAField.fields;
            let finalContent = auxFields.map( (item: any, index: number) => this.renderFUAFieldFromSchema( item, index, `${prefix}-field-${fieldIndex}`) ).join('');
            extraStyles = `
                width:  ${auxFUAField.width.toFixed(1)}mm;    
                height: ${auxFUAField.height.toFixed(1)}mm;  
            `;
            fieldContent = `
                <tr>
                    <td style="padding: 0px;" class="field-content"> 

                            ${finalContent}

                    <td>
                </tr>
            `;
        }

        fieldContent = `
            <style>
                #${prefix}-field-${fieldIndex} {
                    top:    ${auxFUAField.top.toFixed(1)}mm;
                    left:   ${auxFUAField.left.toFixed(1)}mm;
                    ${extraStyles}
                    ${auxWidth}
                }
            </style>
            <table id="${prefix}-field-${fieldIndex}" class="table-field" >
                ${label}
                ${colgroups}
                ${fieldContent}
            </table>
        `;


        return fieldContent;
    };

    // Render FUA Field row from jsonc schema
    private static renderFUAFieldTableRowFromSchema( auxRow : any, index : number, colAmount : number, prefix: string) : string {
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
                <td id="${prefix}-row-${index}-cell-${i}" class="field-border text-container" > 
                    ${cells?.[i]?.text ?? ''} 
                </td>
            `;
            rowContent.push(auxCellContent);
        }

        htmlContent = `
            <tr ${height} class="field-border">
                ${rowContent.length > 0 ? rowContent.join('') : ''}
            </tr>
        `;

        return htmlContent;
    };


    // Generate demo mappings from visit json payload
    public static generateMappingsDemo(visitPayload : any) : Map<string, Object[]>{

        // Fields mapping for section IPRESS Data
        let IPRESSDataSectionMap = new Map();

        let visitDateMappings = {
            valueType: "Table",
            values: new Array()
        };
        
        // Fill Dia of Visit Time
        visitDateMappings.values.push({
            column: 1,
            row: 1,
            value: visitPayload.startDatetime?.slice(8, 10) ?? ''
        });

        // Fill Mes of Visit Time
        visitDateMappings.values.push({
            column: 2,
            row: 1,
            value: visitPayload.startDatetime?.slice(5, 7) ?? ''
        });

        // Fill Año of Visit Time
        visitDateMappings.values.push({
            column: 2,
            row: 1,
            value: visitPayload.startDatetime?.slice(0, 4) ?? ''
        });

        IPRESSDataSectionMap.set("Visit Date",visitDateMappings);


        // Visit TIme Mapping
        let visitTimeMappings = {
            valueType: "Box",
            value: ""
        };

        // Fill Hour of Visit Time
        visitTimeMappings.value = visitPayload.startDatetime?.slice(11, 16) ?? '';

        IPRESSDataSectionMap.set("Visit Time", visitTimeMappings);


        // Fill IPRESS Provider
        let ipressProviderMappings = {
            valueType: "Table",
            value: new Array()            
        };

        ipressProviderMappings.value.push({
            column: 1,
            row: 2,
            value: "00000066"
        });

        ipressProviderMappings.value.push({
            column: 2,
            row: 2,
            value: "SANTA CLOTILDE"
        });

        IPRESSDataSectionMap.set("Visit Time",visitDateMappings);

        // Mapping of pagina_2
        let page1Map = new Map();
        page1Map.set("IPRESS Data", IPRESSDataSectionMap);


        // Mapping of pagina_2
        let page2Map = new Map();

        // Mapping of FUA
        let fuaMap = new Map();
        fuaMap.set("pagina_1",page1Map);
        fuaMap.set("pagina_2",page2Map);

        return fuaMap;
    }

}

export default FUARenderingUtils;