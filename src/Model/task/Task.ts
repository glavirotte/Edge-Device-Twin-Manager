import { Agent } from "../Agent"
import { IResponse } from "../interfaces/IResponse"
import { toTimestamp } from "../Utils"

enum TaskState{
    READY,
    EXECUTING,
    SLEEPING,   // Waiting for the right timestamp to continue the execution
    WAITING,    // Waiting for the device to be available
    COMPLETED,  // Valid response from the device
    ABORTED,    // Task canceled by the user
}

class Task{
    private args:Array<any>
    private method:Function
    private agent:Agent
    private executionTimestamp:Number
    private creationTimestamp:Number
    private date:string
    private state:TaskState

    constructor(agent:Agent, method:Function, args:Array<any>, date:string){
        this.date = date
        this.creationTimestamp = Date.now()/1000
        this.args = args
        this.method = method
        this.agent = agent
        this.executionTimestamp = toTimestamp(date)     // If error in date parsing, executionTimeStamp = 0
        this.state = TaskState.READY
    }

    public async execute():Promise<IResponse | undefined>{  // This method is called when its time to perform a task
        function timeout(s:number) {
            return new Promise(resolve => setTimeout(resolve, s*1000));
        }
        async function sleep(s:number) {
            await timeout(s);
            console.log("Finished waiting !")
        }

        this.state = TaskState.EXECUTING
        const timeToWait = this.computeTimeToWait()
        if(timeToWait > 0){     // If the task has to before executing
            console.log("Waiting for ", timeToWait, "s ...")
            this.state = TaskState.SLEEPING
            await sleep(Number(timeToWait))
            this.state = TaskState.EXECUTING
            const boundFunction = this.method.bind(this.agent, this.args)
            const res:IResponse | undefined = await boundFunction()
            res !== undefined ? this.state = TaskState.COMPLETED : this.state = TaskState.WAITING
            return res
        }else{  // If the task can be performed immediatly
            const boundFunction = this.method.bind(this.agent, this.args)     // Bind method to the agent
            const res:IResponse | undefined = await boundFunction() // Call the method and get the response
            res !== undefined ? this.state = TaskState.COMPLETED : this.state = TaskState.WAITING
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
    public cancelTask(){
        this.state = TaskState.ABORTED
    }
    public getState(){
        return this.state
    }
    public setState(state:TaskState){
        this.state = state
    }
}

export { Task, TaskState}