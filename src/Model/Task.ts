class Task{

    private args:Array<string>
    private functionName:string


    constructor(args:Array<string>, functionName:string){
        this.args = args
        this.functionName = functionName
    }

    public getArgs():Array<string>{
        return this.args
    }
    public getFunctionName(){
        return this.functionName
    }

}

export { Task }