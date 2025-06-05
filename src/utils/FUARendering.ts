// Interfaces

import FUAPageService from "../services/FUAPageService";
import FUASectionService from "../services/FUASectionService";

interface FUAFormat {
    id: number; 
    uuid: string;
    pages: Array<any>; // Array of FUAPages
}

interface FUAPage {
    id: number;
    uuid: string;
}


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
                <div class="fua-container">
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

            htmlContent = ( sectionsContent ? sectionsContent.map( section => `
                <table class="table-section">
                    <tr class="table-row">
                        <td class="table-data">
                            ${ section }
                        </td>
                    </tr>                    
                </table>
            `).join('') : '' );    
           
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
        
        
        // title, showTitle
        let title = '';
        if(FUASection.showTitle == true){
            title = `
                <tr>
                    <th class="section-header"> ${FUASection.title ?? ''} </th>
                </tr>
            `;            
        }
        
        let htmlContent = `
            <table class="auxTable" style="height: ${FUASection.height.toString()}mm;">
                  
                ${title}

                <tr>                    
                    <td>
                        <p> Fields </p>
                        <p> Fields </p>
                        <p> Fields </p>
                    </td>
                </tr>                    
            </table>
        `;

        return htmlContent;
    }

    public static renderFUAField( FUAField : any, index: number ): string {
        let content = `
            <div class="fua-container">
                <p>This is a field</p>
            </div>
        `;

        return content;
    }


}

export default FUARenderingUtils;