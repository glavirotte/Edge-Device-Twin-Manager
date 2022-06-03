import { Task } from "./Task"

class TaskQueue {

    private queue:Array<Task>

    constructor(){
        this.queue = new Array()
    }

    public addTask(task:Task){
        this.queue.unshift(task)
        console.log("Adding task: ", task, ", to task queue !")
    }
    public getNextTask():Task | undefined{
        return this.queue.pop()
    }
    public getArrayLength():number{
        return this.queue.length
    }

}

// Interface that an item added to the queue needs to conform to

export{ TaskQueue }