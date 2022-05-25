class Task{

    methodName:string
    args:Array<string>

    constructor(methodName:string, args:Array<string>){
        this.methodName = methodName
        this.args = args
    }

    public getMethodName():string{
        return this.methodName
    }

    public getArgs():Array<string>{
        return this.args
    }
}

export { Task }