/*#######################################################  

This class describes the Application object which is given
to the agent by the synchronizer and will be uploaded. 

#########################################################*/

class ApplicationTwin{
    
    name:string     // The name of the app
    location:string // Where the source file is located (.eap)

    public constructor (name:string, location:string){
        this.name = name
        this.location = location
    }

/*------------------ Getters & Setters ------------------------ */

    public getName():string{
        return this.name
    }
    public getLocation():string{
        return this.location
    }
}

export { ApplicationTwin }