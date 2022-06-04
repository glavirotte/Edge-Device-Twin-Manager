import { Device } from "./Device"
import { IResponse } from "./interfaces/IResponse"
import { toTimestamp } from "./Utils"

class Task{

    private args:Array<string>
    private method:Function
    private device:Device
    private executionTimestamp:Number
    private creationTimestamp:Number
    private date:string

    constructor( device:Device, method:Function, args:Array<string>, date:string){
        this.date = date
        this.creationTimestamp = Date.now()/1000
        this.args = args
        this.method = method
        this.device = device
        this.executionTimestamp = toTimestamp(date)     // If error in date parsing, executionTimeStamp = 0
    }


    public async execute():Promise<IResponse | undefined>{
        function timeout(s:number) {
            return new Promise(resolve => setTimeout(resolve, s*1000));
        }
        async function sleep(s:number) {
            await timeout(s);
            console.log("Finished waiting !")
        }

        const timeToWait = this.computeTimeToWait()
        if(timeToWait > 0){
            console.log("Waiting for ", timeToWait, "s ...")
            await sleep(Number(timeToWait))
            const boundFunction = this.method.bind(this.device)
            const res:IResponse | undefined = await boundFunction()
            console.log(res)
            return res
        }else{
            const boundFunction = this.method.bind(this.device)
            const res:IResponse | undefined = await boundFunction()
            return res
        }
    }

/*------------------ Getters & Setters ------------------------ */

    public getArgs():Array<string>{
        return this.args
    }

    public getExecutionTimestamp():Number{
        return this.executionTimestamp
    }

    public getDate():string{
        return this.date
    }

    public computeTimeToWait():number{
        const result = Number(this.executionTimestamp) - Date.now()/1000
        if(result < 0) {
           return 0
        }else{
            return result
        }
    }
    public getCreationTimestamp(){
        return this.creationTimestamp
    }
}

export { Task }