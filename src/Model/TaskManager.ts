import { response } from "express"
import { IResponse } from "./interfaces/IResponse"
import { Routine } from "./Routine"
import { Task, TaskState } from "./Task"
import { TaskQueue } from "./TaskQueue"

class TaskManager{
    private taskList:Array<Task>
    private waitingQueue:TaskQueue
    constructor(){
        this.waitingQueue = new TaskQueue()
        this.taskList = new Array()
        this.manageTasks()
    }

    public async registerTask(task:Task):Promise<IResponse | undefined>{
        this.taskList.push(task)
        const response = await task.execute()
        if(response === undefined){
            this.waitingQueue.addTask(task)
            this.removeTaskFromTaskList(task)
        }
        return response
    }

    public async registerRoutine(routine:Routine){
        const tasks = routine.destruct()
        var responses:IResponse | undefined [] = new Array()
        const promises = new Array()
        tasks.forEach(task => {
            promises.push(this.registerTask(task))
        });

        await Promise.all(promises).then((values:IResponse | undefined []) => {responses = values})
        
        for(var i = 0; i<responses.length; i++){
            routine.getResultTaskMap().set(responses[i], tasks[i])
        }
        return responses
    }

    public removeTaskFromTaskList(task:Task){
        const index = this.taskList.indexOf(task)
        this.taskList.splice(index, 1)
    }

    // Check every x seconds the state of every task
    private async manageTasks(){

        setInterval(async () => {
            this.taskList.forEach(task => {

                switch (task.getState()) {
                    case TaskState.COMPLETED:
                        this.removeTaskFromTaskList(task)
                        break;

                    default:
                        break;
                }
            });
        }, 100)
    }
    
    // Performs the tasks present in the task queue
    public async executeTasksInWaitingQueue():Promise<Array<IResponse | undefined>>{    // Concurent modifications possible !!!
        
        const responses:(IResponse | undefined) [] = new Array()
        const tasks = this.waitingQueue.getArray().slice().reverse()
        for (const task of tasks){
            if(task !== undefined){
                const res = await task.execute()
                this.waitingQueue.pop()
                responses.push(res)
            }
        }        
        return responses
    }

}
export { TaskManager }