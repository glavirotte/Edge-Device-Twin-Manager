/*#######################################################  

This class describes the Application object which is given
to the Camera by the device manager and will be uploaded. 

#########################################################*/

class Application{
    
     name:string     // The name of the app
    private location:string // Where the source file is located (.eap)

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

export { Application }