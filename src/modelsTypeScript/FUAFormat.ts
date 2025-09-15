
import BaseFieldFormEntity, { BaseFieldFormEntityInterface } from "./BaseFieldFormEntity";
import FUAPage, { FUAPageInterface } from "./FUAPage";
import { any, z } from "zod";
import { FUAPageSchema } from "./FUAPage";
import FUARenderingUtils from "../utils/FUARendering";



interface FUAFormatInterface extends BaseFieldFormEntityInterface{
    name: string;
    pages?: Array<FUAPage>;
};

export const FUAFormatSchema = z.object({
    name: z.string(),
    pages: z.array(z.any()).optional(),
});


class FUAFormat extends BaseFieldFormEntity {
    name: string;
    pages: Array<FUAPage>;


    constructor(aux: FUAFormatInterface) {
        const result = FUAFormatSchema.safeParse(aux);
        if (!result.success) {
            const newError = new Error('Error in FUA Format (object) - Invalid FUAFormatInterface - constructor');
            (newError as any).details = result.error;
            throw newError;
        }
        super(aux);
        this.name = aux.name;
        this.pages = new Array<FUAPage>(); 
        // Build the sons objects
        if(aux.pages){
            aux.pages.forEach( (auxPage : any, index : number) => {

            })
            // We assume is an array            
            for( const auxPage of aux.pages){

                const auxNewpage = new FUAPage(auxPage as FUAPageInterface);
                this.pages.push(auxNewpage);
            }            
        }
    }

    get getName() { return this.name; }
    set setName(value: string) { this.name = value; }

    get getPages() { return this.pages; }
    set setPages(value: Array<FUAPage>) { this.pages = value; }

    public async renderHtmlContent(printMode : boolean) : Promise<string> {
        try{
            const content =  await FUARenderingUtils.renderFUAFormatFromSchema(this, printMode);
            return content;
        }catch(err : any){
            console.error(err);
            throw err;
        }
    } 
}

export default FUAFormat;