/*#######################################################  

This class represent the current known state of the Device
with the applications installed 

#########################################################*/

import { ApplicationProperties, IResponse } from "./interfaces/IResponse"
import { writeJSON } from "./Utils"

class Twin {
    private id:string
    private applications: ApplicationProperties | undefined

    public constructor(id:string){
        this.id = id
        this.applications = {} as ApplicationProperties | undefined
    }

    // Update the state of the Twin by storing values from last request
    updateState(response: IResponse){
        this.applications = response.reply.application?.[0].$
        writeJSON(this, `./src/Data_Storage/Twins/${this.id}-Twin.json`)
        console.log(this)
    }
}

export { Twin }