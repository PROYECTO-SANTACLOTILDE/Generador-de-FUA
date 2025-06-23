// Interfaces

import FUAFieldService from "../services/FUAFieldService";
import FUAPageService from "../services/FUAPageService";
import FUASectionService from "../services/FUASectionService";



class FUARenderingUtils {
    

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

        let htmlContent = `
            <!DOCTYPE html>
            <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Previsualizacion de FUA</title>
                    <link rel="stylesheet" href="/FUA_Previsualization.css">
                </head>
                <body>
                    ${ formatContent }
                </body>
            </html>
        `;

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

        // Get FUA Section Fields
        try {
            auxSectionFields = await FUASectionService.getFUAFieldsById(FUASection.id);
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

        let fieldsHtmlContent = fieldsContent.length == 0 ? `<p> No hay campos en esta seccion <p>` : fieldsContent.join('');

        let htmlContent = `
            <table id="section-${index.toString()}" class="table-section" style="height: ${FUASection.bodyHeight.toFixed(1)}mm;">
                  
                ${title}

                <tr>                    
                    <td class="section-content">
                        ${fieldsHtmlContent}
                    </td>
                </tr>                    
            </table>
        `;

        return htmlContent;
    }

    public static async renderFUAField( auxFUAField : any, index: number ): Promise<string> {
        
        // Get columns with row and cells
        let columns = [];
        try {
            columns = await FUAFieldService.getFUAColumnsByIdOrUUID(auxFUAField.id);
        }catch(error: any){
            console.error('Error in FUA Rendering Utils - renderFUAField: ', error);
            (error as Error).message =  'Error in FUA Rendering Utils - renderFUAField: ' + (error as Error).message;
            throw error;
        }

        // Get Rows of each Column
        columns.foreach( (auxColumn: any, index: number) => {
            //auxColumn.row = await 
        });
        
        let fieldContent = '';
        /* try {

        }catch(error: any){

        } */

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