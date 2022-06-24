/*#######################################################  

This class describes the Application object which is given
to the agent by the synchronizer and will be uploaded. 

#########################################################*/

import {ApplicationTwinProperties} from "./ApplicationTwinProperties"


class ApplicationTwin{
    
    // Where the source file is located (.eap) it can be on the fs or remotely
    reported: ApplicationTwinProperties
    desired:ApplicationTwinProperties

    public constructor (Name:string, resourceLocation:string){
        this.reported = new ApplicationTwinProperties()
        this.reported.Name = Name
        this.desired = new ApplicationTwinProperties()
        this.desired.ResourceLocation = resourceLocation
    }

    public sync(reported:ApplicationTwinProperties){
        this.reported = reported
    }

    
/*------------------ Getters & Setters ------------------------ */

    public getName(){
        return this.reported.Name
    }
    public getLocation(){
        return this.reported.ResourceLocation
    }

}

export { ApplicationTwin }