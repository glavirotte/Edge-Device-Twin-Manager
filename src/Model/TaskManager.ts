import { addListener } from "process"
import { IResponse } from "./interfaces/IResponse"
import { Routine } from "./Routine"
import { Task, TaskState } from "./Task"
import { TaskQueue } from "./TaskQueue"
import { DeviceState, Twin } from "./Twin"

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
            console.log("Task added to waiting queue", task)
        }
        handleResponse(this.twin, response, task)
    }

    public async registerRoutine(routine:Routine, handleResponse:(twin: Twin, response: IResponse | undefined, task: Task) => void):Promise<void>{
        const tasks = routine.destruct()
        var responses:IResponse | undefined [] = new Array()
        const promises = new Array()
        tasks.forEach(task => {
            promises.push(this.registerTask(task, handleResponse))
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
    
    // Performs the tasks present in the task queue one by one
    public async executeTasksInWaitingQueue():Promise<Array<IResponse | undefined>>{    // Concurent modifications possible !!!
        const responses:(IResponse | undefined) [] = new Array()
        const tasks = this.waitingQueue.getArray().slice().reverse()
        for (const task of tasks){
            if(task !== undefined){
                const res = await task.execute()
                task.setState(TaskState.COMPLETED)  // Here we suppose that all the task are successfully performed, but we cannot be sure
                this.waitingQueue.pop()             // Has to be fixed in a futur implementation
                responses.push(res)
            }
        }
        return responses
    }

}
export { TaskManager }