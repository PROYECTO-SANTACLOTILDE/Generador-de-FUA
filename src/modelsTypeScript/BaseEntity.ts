interface BaseEntityInterface {
    id: number;
    uuid: string;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedby?: Date;
    active: boolean;
    inactiveBy?: string;
    inactiveAt?: Date;
    inactiveReason?: string;
};

class BaseEntity {
    id: number;
    uuid: string;
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
    updatedby?: Date;
    active: boolean;
    inactiveBy?: string;
    inactiveAt?: Date;
    inactiveReason?: string;

    constructor(aux: BaseEntityInterface){
        this.id = aux.id;
        this.uuid = aux.uuid;
        this.createdAt = new Date(aux.createdAt);
        this.createdBy = aux.createdBy;
        this.updatedAt = aux.updatedAt ? new Date(aux.updatedAt) : undefined;
        this.updatedby = aux.updatedby ? new Date(aux.updatedby) : undefined;
        this.active = aux.active;
        this.inactiveBy = aux.inactiveBy;
        this.inactiveAt = aux.inactiveAt ? new Date(aux.inactiveAt) : undefined;
        this.inactiveReason = aux.inactiveReason;
    }

    get getId() { return this.id; }
    //set setId(value: number) { this.id = value; }

    get getUuid() { return this.uuid; }
    //set setUuid(value: string) { this.uuid = value; }

    get getCreatedBy() { return this.createdBy; }
    //set setCreatedBy(value: string) { this.createdBy = value; }

    get getUpdatedby() { return this.updatedby; }
    set setUpdatedby(value: Date | undefined) { this.updatedby = value; }

    get getActive() { return this.active; }
    set setActive(value: boolean) { this.active = value; }

    get getInactiveBy() { return this.inactiveBy; }
    set setInactiveBy(value: string | undefined) { this.inactiveBy = value; }

    get getInactiveAt() { return this.inactiveAt; }
    set setInactiveAt(value: Date | undefined) { this.inactiveAt = value; }

    get getInactiveReason() { return this.inactiveReason; }
    set setInactiveReason(value: string | undefined) { this.inactiveReason = value; }

    get getCreatedAt() { return this.createdAt; }
    //set setCreatedAt(value: Date) { this.createdAt = value; }

    get getUpdatedAt() { return this.updatedAt; }
    //set setUpdatedAt(value: Date) { this.updatedAt = value; }
};

export {
    BaseEntityInterface,
};
export default BaseEntity;