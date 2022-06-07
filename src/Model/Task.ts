import { Agent } from "./Agent"
import { IResponse } from "./interfaces/IResponse"
import { toTimestamp } from "./Utils"

enum State{
    READY,
    EXECUTING,
    WAITING,
    COMPLETED,
}

class Task{

    private args:Array<string>
    private method:Function
    private agent:Agent
    private executionTimestamp:Number
    private creationTimestamp:Number
    private date:string
    private state:State

    constructor(agent:Agent, method:Function, args:Array<string>, date:string){
        this.date = date
        this.creationTimestamp = Date.now()/1000
        this.args = args
        this.method = method
        this.agent = agent
        this.executionTimestamp = toTimestamp(date)     // If error in date parsing, executionTimeStamp = 0
        this.state = State.READY
    }

    public async execute():Promise<IResponse | undefined>{  // This method is called when its time to perform a task
        this.state = State.EXECUTING
        function timeout(s:number) {
            return new Promise(resolve => setTimeout(resolve, s*1000));
        }
        async function sleep(s:number) {
            await timeout(s);
            console.log("Finished waiting !")
        }

        const timeToWait = this.computeTimeToWait()
        if(timeToWait > 0){     // If the task has to before executing
            console.log("Waiting for ", timeToWait, "s ...")
            this.state = State.WAITING
            await sleep(Number(timeToWait))
            const boundFunction = this.method.bind(this.agent)
            const res:IResponse | undefined = await boundFunction()
            this.state = State.COMPLETED
            return res
        }else{  // If the task can be performed immediatly
            const boundFunction = this.method.bind(this.agent)     // Bind method to the agent
            const res:IResponse | undefined = await boundFunction() // Call the method and get the response
            res !== undefined ? this.state = State.COMPLETED : this.state = State.WAITING
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
    public setDate(date:string){
        this.date = date
    }

/*------------------ Utils ------------------------ */
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

export { Task, State}