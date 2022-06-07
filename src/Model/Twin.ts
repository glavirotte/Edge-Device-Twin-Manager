/*#######################################################  

This class represent the current known state of the Device
with the applications installed 

#########################################################*/

import { Synchronizer } from "./DeviceManager"
import { PropertyList, IResponse, ApplicationEntity, } from "./interfaces/IResponse"
import { ITwin, State } from "./interfaces/ITwin"
import { TaskQueue } from "./TaskQueue"
import { writeJSON } from "./Utils"

class Twin implements ITwin{
    private id:string
    private ipAddress:string
    private properties: PropertyList | undefined
    private applications: (ApplicationEntity)[] | null
    private lastseen:number     // last time the device was online
    private lastentry:number    // last time the device start connection with the system
    private state:State         // Current state
    public  lightStatus:boolean
    private taskQueue:TaskQueue

    // The followings fields are used to handle changes via the proxy
    public proxyswitchLight:boolean

    public constructor(ipAddress:string){
        this.id = {} as string
        this.ipAddress = ipAddress
        this.properties = {} as PropertyList | undefined
        this.applications = {} as (ApplicationEntity)[] | null
        this.lastseen = 0
        this.lastentry = 0
        this.state = State.OFFLINE
        this.lightStatus = {} as boolean
        this.taskQueue = new TaskQueue()
        this.proxyswitchLight = {} as boolean
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
            if(response?.data?.status !== undefined && response.method === 'getLightStatus'){
                this.lightStatus = response.data.status
            }
            this.storeTwinObject()
        } catch (error) {
            console.log(error)
        }
        return result

    }

    public storeTwinObject(){
        writeJSON(this, `./src/Model/Data_Storage/Twins/${this.id}-Twin.json`)
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
    public switchLight():void{
        if(this.lightStatus){
            this.lightStatus = false
        }else{
            this.lightStatus = true
        }
        this.storeTwinObject()
    }
    public setLightStatus(status:boolean){
        this.lightStatus = status
    }
    public getTaskQueue():TaskQueue{
        return this.taskQueue
    }

}

export { Twin, State }