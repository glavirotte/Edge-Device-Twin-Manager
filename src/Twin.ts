/*#######################################################  

This class represent the current known state of the Device
with the applications installed 

#########################################################*/

import { Device } from "./Device";
import { ApplicationEntity, IResponse } from "./interfaces/IResponse"

class Twin {

    private device:Device
    private applications: (ApplicationEntity)[] | null | undefined

    public constructor(device:Device){
        this.device = device
        this.applications = JSON.parse('{}')
    }

    updateApplicationList(data: IResponse){
        this.applications = data.reply.application
        console.log(this.applications)
    }
}

export { Twin }