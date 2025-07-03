import BaseEntity from "./BaseEntity";
import { BaseEntityInterface } from "./BaseEntity";

export interface BaseFieldFormEntityInterface extends BaseEntityInterface {
    codename: string;
    versionTag: string;
    versionNumber: number;
};


class BaseFieldFormEntity extends BaseEntity {
    codename: string;
    versionTag: string;
    versionNumber: number;

    constructor(aux: BaseFieldFormEntityInterface){
        super(aux);
        this.codename = aux.codename;
        this.versionTag = aux.versionTag;
        this.versionNumber = aux.versionNumber;
    }

    get getCodename() { return this.codename; }
    set setCodename(value: string) { this.codename = value; }

    get getVersionTag() { return this.versionTag; }
    set setVersionTag(value: string) { this.versionTag = value; }

    get getVersionNumber() { return this.versionNumber; }
    set setVersionNumber(value: number) { this.versionNumber = value; }
}

export default BaseFieldFormEntity;