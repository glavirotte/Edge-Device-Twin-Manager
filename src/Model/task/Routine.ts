import { IResponse } from "../interfaces/IResponse";
import { Task } from "./Task";
import { toTimestamp } from "../Utils";


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

    public destruct(){
        const tasks = new Array()
        this.tasks.forEach(task => {
            tasks.push(task)
        });
        return tasks
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