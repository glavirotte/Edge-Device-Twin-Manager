/*#######################################################  

This class represent the current known state of the Device
with the applications installed 

#########################################################*/

import { DeviceManager } from "./DeviceManager"
import { PropertyList, IResponse, ApplicationEntity, } from "./interfaces/IResponse"
import { writeJSON } from "./Utils"

class Twin {
    private id:string
    private ipAddress:string
    private properties: PropertyList | undefined
    private applications: (ApplicationEntity)[] | null
    private lastseen:number
    private lastentry:number
    
    public constructor(ipAddress:string, deviceManager:DeviceManager){
        this.id = {} as string
        this.ipAddress = ipAddress
        this.properties = {} as PropertyList | undefined
        this.applications = {} as (ApplicationEntity)[] | null
        this.lastseen = 0
        this.lastentry = 0
    }

    // Update the state of the Twin by storing values from last request
    updateState(response: IResponse):string{
        var result:string = ""
        try {
            if(response?.data?.propertyList !== undefined){
                this.properties = response?.data?.propertyList
                this.id = this.properties.SerialNumber
                result = this.id
            }
            if(response?.reply?.application?.[0].$ !== undefined){
                this.applications = response?.reply?.application
            }
            writeJSON(this, `./src/Data_Storage/Twins/${this.id}-Twin.json`)
            console.log(this)
        } catch (error) {
            console.log(error)
        }

        return result

    }

/*------------------ Getters & Setters ------------------------ */

    getApplications():(ApplicationEntity)[] | null{
        return this.applications
    }
    getID(){
        return this.id
    }
    setIPAddress(ipAddress:string){
        this.ipAddress = ipAddress
    }
}

export { Twin }