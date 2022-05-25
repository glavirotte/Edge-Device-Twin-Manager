import { Task } from "./Task"

class TaskQueue {

    private queue:Array<Task>

    constructor(){
        this.queue = new Array()
    }

    public addTask(task:Task){
        this.queue.unshift(task)
    }

    public getNextTask():Task | undefined{
        return this.queue.pop()
    }

    public getArrayLength():number{
        return this.queue.length
    }

}

export{ TaskQueue }