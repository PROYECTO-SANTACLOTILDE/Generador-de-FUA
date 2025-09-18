import BaseEntity from "./BaseEntity";
import { BaseEntityInterface } from "./BaseEntity";
import { z } from "zod";


export interface BaseFieldFormEntityInterface extends BaseEntityInterface {
    codeName: string;
    versionTag: string;
    versionNumber: number;
}

export const BaseFieldFormEntitySchema = z.object({
    codeName: z.string(),
    versionTag: z.string(),
    versionNumber: z.number().default(1),
});




class BaseFieldFormEntity extends BaseEntity {
    codeName: string;
    versionTag: string;
    versionNumber: number;

    constructor(aux: BaseFieldFormEntityInterface, index? : number){
        const result = BaseFieldFormEntitySchema.safeParse(aux);
        if (!result.success) {
            const newError = new Error('Error in BaseFieldFormEntity - Invalid BaseFieldFormEntityInterface - constructor '+(aux.versionTag ? aux.versionTag + ' ' : '')+' in element '+(index ?? 'null')  );
            (newError as any).details = result.error;
            throw newError;
        }
        super(aux);
        this.codeName = aux.codeName;
        this.versionTag = aux.versionTag;
        this.versionNumber = aux.versionNumber;
    }

    get getCodeName() { return this.codeName; }
    set setCodeName(value: string) { this.codeName = value; }

    get getVersionTag() { return this.versionTag; }
    set setVersionTag(value: string) { this.versionTag = value; }

    get getVersionNumber() { return this.versionNumber; }
    set setVersionNumber(value: number) { this.versionNumber = value; }
}

export default BaseFieldFormEntity;