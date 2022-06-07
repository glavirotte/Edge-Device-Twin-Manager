import { IResponse } from "./interfaces/IResponse";
import { Task } from "./Task";

class Routine {
    private date:string
    private tasks:Array<Task>

    constructor(date:string){
        this.date = date
        this.tasks = new Array()
    }

/*------------------ Getters & Setters ------------------------ */

    public addTask(task:Task){
        this.tasks.push(task)
    }
    public async execute(){
        const promises = new Array()
        this.tasks.forEach(task => {
            promises.push(task.execute)
        });
        var responses:IResponse | undefined [] = new Array()
        await Promise.all(promises).then((values:IResponse | undefined []) => {console.log(values); responses = values})
        return responses
        // this.tasks.forEach(task => {
        //     task.execute()
        //     .then((response) => {
        //         responses.push(response);
        //         if(responses.length === this.tasks.length){
        //             return responses
        //         }
        //     })
        // });
    }    
}

export { Routine }