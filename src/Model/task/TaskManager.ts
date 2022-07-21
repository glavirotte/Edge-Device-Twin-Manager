import { IResponse } from "../interfaces/IResponse"
import { Routine } from "./Routine"
import { Task, TaskState } from "./Task"
import { TaskQueue } from "./TaskQueue"
import { DeviceState, Twin } from "../twin/Twin"

class TaskManager{
    private taskList:Array<Task>
    private waitingQueue:TaskQueue
    private twin:Twin
    constructor(twin:Twin){
        this.twin = twin
        this.waitingQueue = new TaskQueue()
        this.taskList = new Array()
        this.manageTasks(1000)
    }

    public async registerTask(task:Task, handleResponse:(twin: Twin, response: IResponse | undefined, task: Task) => void):Promise<void>{
        this.taskList.push(task)
        const response = await task.execute()
        if(response === undefined){
            this.twin.setDeviceState(DeviceState.UNREACHABLE)
            this.waitingQueue.addTask(task)
            console.log("Task added to waiting queue", task, this.waitingQueue)
        }
        handleResponse(this.twin, response, task)
    }

    public async registerRoutine(routine:Routine, handleResponse:(twin: Twin, response: IResponse | undefined, task: Task) => void):Promise<void>{
        const tasks = routine.destruct()
        tasks.forEach(task => {
            this.registerTask(task, handleResponse)
        });
    }

    public removeTaskFromTaskList(task:Task){
        const index = this.taskList.indexOf(task)
        this.taskList.splice(index, 1)
    }

    // Check every x seconds the state of every task
    private async manageTasks(ms:number){

        setInterval(async () => {
            for (const task of this.taskList){
                switch (task.getState()) {
                    case TaskState.COMPLETED:
                        this.removeTaskFromTaskList(task)
                        break;

                    default:
                        break;
                }
            }
        }, ms)
    }
    
    // Performs the tasks present in the task queue one by one, if completed, the task leave the queue
    public async executeTasksInWaitingQueue():Promise<Array<IResponse | undefined>>{    // Concurent modifications possible !!!
        const responses:(IResponse | undefined) [] = new Array()
        const tasks = this.waitingQueue.getArray().slice().reverse()
        var index = this.waitingQueue.getArrayLength() -1

        for (const task of tasks){
            if(task !== undefined){
                const res:IResponse | undefined = await task.execute()
                if(task.getState() === TaskState.COMPLETED){
                    this.waitingQueue.remove(index, 1)
                    responses.push(res)
                }else if(task === undefined){
                    this.waitingQueue.remove(index, 1)
                }
            }
            index --
        }
        return responses
    }

    public getWaitingQueue():TaskQueue{
        return this.waitingQueue
    }
    public getTaskList():Array<Task>{
        return this.taskList
    }
}

export { TaskManager }