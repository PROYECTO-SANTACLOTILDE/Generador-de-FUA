import { isValidUUIDv4 } from "./utils";



class FUAReference{
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

    constructor(queue: Array<FUAReference> = []){
        this.queue  = queue;
        this.numberOfFUA = this.queue.length;
    }

    public getQueue() : Array<FUAReference> {
        return this.queue;
    }

    public getNumberOfFUA() : number{
        return this.numberOfFUA;
    }

    public setQueue(newQueue : Array<FUAReference>) : void{
        this.queue = newQueue;
    }

    // public setNumberOfFUA(newNumberOfFUA : number) : void{
    //     this.numberOfFUA = newNumberOfFUA;
    // }

    public enqueue(newFUAReference : FUAReference) : void{
        this.queue.push(newFUAReference);
    }

    public dequeue(newFUAReference : FUAReference) : FUAReference | undefined{
        return this.queue.shift();
    }

}

// Singleton:

const fUAQueueInstance = new FUAQueue();

export default fUAQueueInstance;