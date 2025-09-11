
import BaseFieldFormEntity, { BaseFieldFormEntityInterface } from "./BaseFieldFormEntity";
import FUAPage from "./FUAPage";
import { z } from "zod";
import { FUAPageSchema } from "./FUAPage";



interface FUAFormatInterface extends BaseFieldFormEntityInterface{
    name: string;
    pages?: Array<FUAPage>;
};

export const FUAFormatSchema = z.object({
    name: z.string(),
    pages: z.array(FUAPageSchema).optional(),
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
        this.pages = aux.pages ?? new Array<FUAPage>();
    }

    get getName() { return this.name; }
    set setName(value: string) { this.name = value; }

    get getPages() { return this.pages; }
    set setPages(value: Array<FUAPage>) { this.pages = value; }
}

export default FUAFormat;