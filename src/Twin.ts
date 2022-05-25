/*#######################################################  

This class represent the current known state of the Device
with the applications installed 

#########################################################*/

import { DeviceManager } from "./DeviceManager"
import { PropertyList, IResponse, ApplicationEntity, } from "./interfaces/IResponse"
import { writeJSON } from "./Utils"

enum State {
    CONNECTED,
    OFFLINE,
}

class Twin {
    private id:string
    private ipAddress:string
    private properties: PropertyList | undefined
    private applications: (ApplicationEntity)[] | null
    private lastseen:number     // last time the device was online
    private lastentry:number    // last time the device start connection with the system
    private state:State         // Current state
    
    public constructor(ipAddress:string, deviceManager:DeviceManager){
        this.id = {} as string
        this.ipAddress = ipAddress
        this.properties = {} as PropertyList | undefined
        this.applications = {} as (ApplicationEntity)[] | null
        this.lastseen = 0
        this.lastentry = 0
        this.state = State.OFFLINE
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
    getLastSeen(){
        return this.lastseen
    }
    setLastSeen(timeStamp:number){
        this.lastseen = timeStamp
        // writeJSON(this, `./src/Data_Storage/Twins/${this.id}-Twin.json`)
    }
    getLastEntry(){
        return this.lastentry
    }
    setLastEntry(timeStamp:number){
        this.lastentry = timeStamp
        // writeJSON(this, `./src/Data_Storage/Twins/${this.id}-Twin.json`)
    }
    getState(){
        return this.state
    }
    setState(s:State){
        this.state = s
        // writeJSON(this, `./src/Data_Storage/Twins/${this.id}-Twin.json`)
    }
}

export { Twin, State}