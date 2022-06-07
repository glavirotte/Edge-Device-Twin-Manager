import { IResponse } from "./interfaces/IResponse";
import { Task } from "./Task";
import { toTimestamp } from "./Utils";

class Routine {
    private date:string
    private tasks:Array<Task>
    private resultTaskMap:Map<IResponse | undefined, Task>
    private executionTimestamp:Number
    private creationTimestamp:Number

    constructor(date:string){
        this.date = date
        this.creationTimestamp = Date.now()/1000
        this.tasks = new Array()
        this.resultTaskMap = new Map()
        this.executionTimestamp = toTimestamp(this.date)     // If error in date parsing, executionTimeStamp = 0
    }

    public addTask(task:Task){
        this.tasks.push(task)
        task.setDate(this.date) // Every task are performed at the date of the routine
    }

    public async execute(){

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
            await sleep(Number(timeToWait))

            const promises = new Array()
            this.tasks.forEach(task => {
                promises.push(task.execute())
            });
            var responses:IResponse | undefined [] = new Array()
            await Promise.all(promises).then((values:IResponse | undefined []) => {responses = values})
            
            for(var i = 0; i<responses.length; i++){
                this.resultTaskMap.set(responses[i], this.tasks[i])
            }
            return responses
        }else{
            const promises = new Array()
            this.tasks.forEach(task => {
                promises.push(task.execute())
            });
            var responses:IResponse | undefined [] = new Array()
            await Promise.all(promises).then((values:IResponse | undefined []) => {responses = values})
            
            for(var i = 0; i<responses.length; i++){
                this.resultTaskMap.set(responses[i], this.tasks[i])
            }
            return responses
        }

    }

/*------------------ Getters & Setters ------------------------ */
    public getResultTaskMap(){
        return this.resultTaskMap
    }
    public setDate(date:string){
        this.date = date
        this.tasks.forEach(task => {
            task.setDate(date)
        });
    }

    public computeTimeToWait():number{
        const result = Number(this.executionTimestamp) - Date.now()/1000
        if(result < 0) {
           return 0
        }else{
            return result
        }
    }
}

export { Routine }