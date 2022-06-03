import { Device } from "./Device"
import { IResponse } from "./interfaces/IResponse"

class Task{

    private args:Array<string>
    private method:Function
    private device:Device
    private executionTimestamp:Number

    constructor( device:Device, method:Function, args:Array<string>, executionTimestamp:Number){
        this.args = args
        this.method = method
        this.device = device
        this.executionTimestamp = executionTimestamp
    }

    public async execute():Promise<IResponse>{
        const boundFunction = this.method.bind(this.device)
        const res:IResponse = await boundFunction()
        console.log(res)
        return res
    }

    public getArgs():Array<string>{
        return this.args
    }
    public getExecutionTimestamp():Number{
        return this.executionTimestamp
    }
}

export { Task }