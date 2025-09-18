import { sequelize } from "../modelsSequelize/database";

export class GlobalTransaction {

    public transaction : any;

    constructor(){
        this.transaction = null;
    }

    public async renewTransaction() {
        this.transaction = await sequelize.transaction();
    }
                                                                                
    public async confirmTransaction() {
        await this.transaction.commit();
        this.transaction = null;
    }

    public async unconfirmTransaction() {
        await this.transaction.rollback();
        this.transaction = null;
    }
}

export let transactionInst = new GlobalTransaction();