import * as fs from "fs";
import * as path from "path";
import dedent from 'dedent';

// Services
import FUAFieldService from "../services/FUAFieldService";
import FUAPageService from "../services/FUAPageService";
import FUASectionService from "../services/FUASectionService";
import { dedentCustom } from "./utils";
import FUAFieldColumnService from "../services/FUAFieldColumnService";



class FUARenderingUtils {
    
    // Get CSS styles from public/FUA_Previsualization.css
    private static async getCSSStyles(): Promise<string> {
        const cssFilePath = path.resolve(__dirname, "../public/FUA_Previsualization.css");
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
                    ${ formatContent }
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

    public static async renderFUASection( FUASection : any, index: number ): Promise<string> {
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
            <table id="section-${index.toString()}" class="table-section" style="height: ${FUASection.bodyHeight.toFixed(1)}mm;">
                  
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
        
        // Get columns 
        /* let columns = [];
        try {
            columns = await FUAFieldColumnService.getListByFUAFieldIdOrUUID(auxFUAField.id.toString());
        }catch(error: any){
            console.error('Error in FUA Rendering Utils - renderFUAField: ', error);
            (error as Error).message =  'Error in FUA Rendering Utils - renderFUAField: ' + (error as Error).message;
            throw error;
        } */

        // Order columns by column index
        //columns.sort((a: any, b: any) => a.columnIndex - b.columnIndex);

             
        /* let columnsContent: string[] = [];
        try {
            columnsContent = await Promise.all( columns.map( (column: any, index: number) => this.renderFUAColumn(column, index) ) );  
        }catch(error: any){
            console.error('Error in FUA Rendering Utils - renderFUAField: ', error);
            (error as Error).message =  'Error in FUA Rendering Utils - renderFUAField: ' + (error as Error).message;
            throw error;
        } */

        /* let label = '';
        if(auxFUAField.showLabel){
            label = `
                <tr>
                    <th class="table-data"> ${auxFUAField.label} </th>
                </tr>
            `;
        } */

        /* let htmlContent = `
            <style>
                #field-${index}-${auxFUAField.codeName} {
                    height: ${auxFUAField.bodyHeight?.toFixed(1) ?? ''}mm;
                    width: ${auxFUAField.bodyWidth?.toFixed(1) ?? ''}mm;
                    top: ${auxFUAField.top?.toFixed(1) ?? ''}mm;
                    left: ${auxFUAField.left?.toFixed(1) ?? ''}mm;
                    position: absolute;
                }
            </style>

            <table id="field-${index}-${auxFUAField.codeName}" class="table-field">
                ${label}
                <tr>
                    <td> <p>FUA Field Body</p> </td>
                </tr>
            </table>
        `; */

        /* let htmlContent = `
            <table id="field-${index}-${auxFUAField.codeName}" class="table-field">
                
                <tr>
                    <td> <p>FUA Field Body</p> </td>
                </tr>
            </table>
        `; */

        //return htmlContent;
        return "";
    }

    public static async renderFUAColumn( auxFUAColumn : any, index: number ): Promise<string> {
        
        // Get rows
        let columns = [];
        try {
            columns = await FUAFieldColumnService.getListByFUAFieldIdOrUUID(auxFUAField.id.toString());
        }catch(error: any){
            console.error('Error in FUA Rendering Utils - renderFUAField: ', error);
            (error as Error).message =  'Error in FUA Rendering Utils - renderFUAField: ' + (error as Error).message;
            throw error;
        }

        // Order columns by column index
        columns.sort((a: any, b: any) => a.columnIndex - b.columnIndex);

             
        let columnsContent: string[] = [];
        try {
            columnsContent = await Promise.all( columns.map( (field: any, index: number) => this.renderFUAField(field, index) ) );  
        }catch(error: any){
            console.error('Error in FUA Rendering Utils - renderFUASection: ', error);
            (error as Error).message =  'Error in FUA Rendering Utils - renderFUASection: ' + (error as Error).message;
            throw error;
        }

        let label = '';
        if(auxFUAField.showLabel){
            label = `
                <tr>
                    <th class="table-data"> ${auxFUAField.label} </th>
                </tr>
            `;
        }

        let htmlContent = `
            <style>
                #field-${index}-${auxFUAField.codeName} {
                    height: ${auxFUAField.bodyHeight?.toFixed(1) ?? ''}mm;
                    width: ${auxFUAField.bodyWidth?.toFixed(1) ?? ''}mm;
                    top: ${auxFUAField.top?.toFixed(1) ?? ''}mm;
                    left: ${auxFUAField.left?.toFixed(1) ?? ''}mm;
                    position: absolute;
                }
            </style>

            <table id="field-${index}-${auxFUAField.codeName}" class="table-field">
                ${label}
                <tr>
                    <td> <p>FUA Field Body</p> </td>
                </tr>
            </table>
        `;

        return htmlContent;
    }


}

export default FUARenderingUtils;