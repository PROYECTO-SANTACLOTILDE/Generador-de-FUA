import { isValidUUIDv4 } from "./utils";


export class FUAReference{
    private uuid: string;
    private visitUUID: string;

    constructor (uuid : string, visitUUID : string){
        if (!isValidUUIDv4(uuid)){
            throw new Error(`Invalid UUIDv4 for uuid: ${uuid}`);
        }
        if (!isValidUUIDv4(visitUUID)){
            throw new Error(`Invalid UUIDv4 for uuid: ${visitUUID}`);
        }

        this.uuid = uuid;
        this.visitUUID = visitUUID;
    }

    public getUUID() : string{
        return this.uuid;
    }

    public getVisitUUID() : string{
        return this.visitUUID;
    }   
    
}

class FUAQueue{
    private queue: Array<FUAReference>;
    private numberOfFUA: number;

    constructor(){
        this.queue  = new Array<FUAReference>();
        this.numberOfFUA = this.queue.length;
    }

    public getQueue() : Array<FUAReference> {
        return this.queue;
    }

    public getNumberOfFUA() : number{
        return this.numberOfFUA;
    }

    public contains(uuid: string): boolean {
        return this.queue.some(fua => fua.getUUID() === uuid);
    }

    public enqueue(newFUAReference : FUAReference) : void{
        if (this.contains(newFUAReference.getUUID())){
            throw new Error(`Fua already in the queue.`); 
        }
        this.queue.push(newFUAReference);
        this.numberOfFUA = this.queue.length
    }

    public dequeue(targetfuaUUID: string): FUAReference {

        const index = this.queue.findIndex(fua => fua.getUUID() === targetfuaUUID);
        
        if (index === -1) {
            throw new Error(`Fua not in the Queue.`);
        }
        const removed = this.queue.splice(index, 1)[0];
        this.numberOfFUA = this.queue.length;

        return removed;
    }
}

// Singleton:

const fUAQueueInstance = new FUAQueue();

export default fUAQueueInstance;