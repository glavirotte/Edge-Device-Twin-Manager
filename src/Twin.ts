/*#######################################################  

This class represent the current known state of the Device
with the applications installed 

#########################################################*/

import { DeviceManager } from "./DeviceManager"
import { PropertyList, ApplicationProperties, IResponse, } from "./interfaces/IResponse"
import { writeJSON } from "./Utils"

class Twin {
    private id:string
    private deviceManager:DeviceManager
    private properties: PropertyList | undefined
    private applications: ApplicationProperties | undefined
    
    
    public constructor(deviceManager:DeviceManager){
        this.id = {} as string
        this.deviceManager = deviceManager
        this.applications = {} as ApplicationProperties | undefined
        this.properties = {} as PropertyList | undefined
    }

    // Update the state of the Twin by storing values from last request
    updateState(response: IResponse){
        try {
            if(response?.data?.propertyList !== undefined){
                this.properties = response?.data?.propertyList
                this.id = this.properties.SerialNumber
                this.deviceManager.updatePhysicalDevice(this)
            }
            if(response?.reply?.application?.[0].$ !== undefined){
                this.applications = response?.reply?.application?.[0].$
            }
            writeJSON(this, `./src/Data_Storage/Twins/${this.id}-Twin.json`)
        } catch (error) {
            console.log(error)
        }
    }

/*------------------ Getters & Setters ------------------------ */
    getApplications():ApplicationProperties | undefined{
        return this.applications
    }
    getID(){
        return this.id
    }
}

export { Twin }