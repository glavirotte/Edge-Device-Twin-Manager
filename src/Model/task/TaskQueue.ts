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
    public pop(){
        this.queue.pop()
    }
    public getArrayLength():number{
        return this.queue.length
    }
    public getArray(){
        return this.queue
    }
    public remove(index:number, deleteCount:number){
        this.queue.splice(index, deleteCount)
    }

}

// Interface that an item added to the queue needs to conform to

export{ TaskQueue }