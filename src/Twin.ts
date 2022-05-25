/*#######################################################  

This class represent the current known state of the Device
with the applications installed 

#########################################################*/

import { DeviceManager } from "./DeviceManager"
import { PropertyList, IResponse, ApplicationEntity, } from "./interfaces/IResponse"
import { ITwin, State } from "./interfaces/ITwin"
import { writeJSON } from "./Utils"


class Twin implements ITwin{
    private id:string
    private ipAddress:string
    private properties: PropertyList | undefined
    private applications: (ApplicationEntity)[] | null
    private lastseen:number     // last time the device was online
    private lastentry:number    // last time the device start connection with the system
    private state:State         // Current state
    private lightStatus:boolean
    
    public constructor(ipAddress:string, deviceManager:DeviceManager){
        this.id = {} as string
        this.ipAddress = ipAddress
        this.properties = {} as PropertyList | undefined
        this.applications = {} as (ApplicationEntity)[] | null
        this.lastseen = 0
        this.lastentry = 0
        this.state = State.OFFLINE
        this.lightStatus = {} as boolean
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
        } catch (error) {
            console.log(error)
        }
        return result

    }

    public storeTwinObject(){
        writeJSON(this, `./src/Data_Storage/Twins/${this.id}-Twin.json`)
        console.log(this)
    }

/*------------------ Getters & Setters ------------------------ */

    public getApplications():(ApplicationEntity)[] | null{
        return this.applications
    }
    public getID():string{
        return this.id
    }
    public setIPAddress(ipAddress:string):void{
        this.ipAddress = ipAddress
    }
    public getLastSeen():number{
        return this.lastseen
    }
    public setLastSeen(timeStamp:number):void{
        this.lastseen = timeStamp
    }
    public getLastEntry():number{
        return this.lastentry
    }
    public setLastEntry(timeStamp:number):void{
        this.lastentry = timeStamp
    }
    public getState():State{
        return this.state
    }
    public setState(s:State):void{
        this.state = s
    }
    public getLightStatus():boolean{
        return this.lightStatus
    }
    public setLightStatus(newLightStatus:boolean):void{
        this.lightStatus = newLightStatus
    }
}

export { Twin, State }