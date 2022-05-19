class Application{
    
    name:string
    location:string

    constructor (name:string, location:string){
        this.name = name
        this.location = location
    }
    getName():string{
        return this.name
    }
    getLocation():string{
        return this.location
    }
}

export { Application }