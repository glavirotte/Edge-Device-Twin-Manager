class Application{
    
    private name:string
    private location:string

    public constructor (name:string, location:string){
        this.name = name
        this.location = location
    }
    public getName():string{
        return this.name
    }
    public getLocation():string{
        return this.location
    }
}

export { Application }