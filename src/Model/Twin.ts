/*#######################################################  
This class represent the current known state of the Device
with the applications installed 
#########################################################*/

import { IHeartBeat } from "./interfaces/IHeartBeat"
import { IFirmwareInfo } from "./interfaces/IFirmwareInfo"
import { PropertyList, IResponse, ApplicationEntity, ApplicationProperties, } from "./interfaces/IResponse"
import { ITwin, DeviceState, TwinState } from "./interfaces/ITwin"
import { writeJSON } from "./Utils"
import {IMQTTClientStatus} from "./interfaces/IMQTTClientStatus"
import {EventFilterListEntity, EventPublicationConfig, IMQTTEventConfig} from "./interfaces/IMQTTEventConfig"
import ini from "ini"
import { ICommon } from "./interfaces/ICommon"

class Twin{
    private id:string
    private serialNumber:string
    private properties: PropertyList | undefined
    private applications: (ApplicationProperties)[] | null
    private lastseen:number     // last time the device was online
    private lastentry:number    // last time the device start connection with the system
    private deviceState:DeviceState         // Current known state of the device
    private twinState:TwinState
    private firmwareInfo: IFirmwareInfo
    private mqttClientStatus:IMQTTClientStatus
    private mqttEventConfig:IMQTTEventConfig
    public  lightStatus:boolean
    private heartBeat: IHeartBeat

    // The followings fields are used to handle changes via the proxy
    public proxyswitchLight:string

    public constructor(id:string){
        this.id = id
        this.serialNumber = {} as string
        this.properties = {} as PropertyList | undefined
        this.applications = new Array<ApplicationProperties>()
        this.heartBeat = {} as IHeartBeat
        this.lastseen = 0
        this.lastentry = 0
        this.deviceState = DeviceState.UNREACHABLE
        this.twinState = TwinState.OUTDATED
        this.lightStatus = {} as boolean
        this.firmwareInfo = {} as IFirmwareInfo
        this.mqttClientStatus = {} as IMQTTClientStatus
        this.mqttEventConfig = {} as IMQTTEventConfig


        this.proxyswitchLight = {} as string
    }

    // Update the state of the Twin by storing values from last request
    updateState(response: IResponse | undefined , heartBeat:IHeartBeat | undefined){
        try {
            if(response !== undefined){
                if(response?.data?.propertyList !== undefined){
                    this.properties = response?.data?.propertyList
                    this.serialNumber = this.properties.SerialNumber
                }
                if(response?.reply?.application?.[0].$ !== undefined){
                    response?.reply?.application.forEach(app => {
                        if(this.applications !== null){
                            this.applications.push(app.$)
                        }
                    });
                }
                if(response?.data?.status !== undefined && response.method === 'getLightStatus'){
                    this.lightStatus = response.data.status as boolean
                }
                if(response.data?.activeFirmwareVersion !== undefined){
                    this.firmwareInfo.activeFirmwarePart = response.data?.activeFirmwarePart
                    this.firmwareInfo.activeFirmwareVersion = response.data?.activeFirmwareVersion
                    this.firmwareInfo.inactiveFirmwareVersion = response.data?.inactiveFirmwareVersion
                    this.firmwareInfo.lastUpgradeAt = response.data?.lastUpgradeAt
                    this.firmwareInfo.isCommitted = response.data?.isCommitted
                }
                if(response.data?.status !== undefined && (response.method === "getClientStatus" || response.method === "activateClient" || response.method === "deactivateClient")){
                    this.mqttClientStatus = response.data?.status ? response.data as IMQTTClientStatus: {} as IMQTTClientStatus
                }
                if(response.method === "getEventPublicationConfig"){
                    this.mqttEventConfig = response.data as IMQTTEventConfig
                }
                if(response.method === "upgrade" && response.data?.firmwareVersion !== undefined){
                    this.firmwareInfo.activeFirmwareVersion = response.data?.firmwareVersion
                }
                
            }else if(heartBeat !== undefined){
                this.heartBeat = heartBeat
                if(!heartBeat.message.data.Topics.startsWith("none")){
                    const topics = ini.parse(heartBeat.message.data.Topics)
                    const common = topics["common"]
    
                    if(this.mqttEventConfig.eventPublicationConfig == undefined){
                        this.mqttEventConfig.eventPublicationConfig = {} as EventPublicationConfig
                        this.mqttEventConfig.eventPublicationConfig.common = {} as ICommon
                    }
                    this.mqttEventConfig.eventPublicationConfig.common = common as ICommon
    
                    const eventFilterList:(EventFilterListEntity)[] = new Array()
                    for (const key of Object.keys(topics)){
                        if(key !== "common"){
                            eventFilterList.push(topics[key])
                        }
                    }
                    this.mqttEventConfig.eventPublicationConfig.eventFilterList = eventFilterList
                }else{
                    console.log("Error while parsing heartbeat topics, check the logs of the camera ! Topics:", heartBeat.message.data.Topics)
                }
                
            }

            this.storeTwinObject()
        } catch (error) {
            console.log(error)
        }
    }

    public storeTwinObject(){
        // console.log(this, "\n")
        writeJSON(this, `./src/Model/Data_Storage/Twins/${this.serialNumber}-Twin.json`)
    }

/*------------------ Getters & Setters ------------------------ */

    public getApplications():(ApplicationProperties)[] | null{
        return this.applications
    }
    public getID():string{
        return this.id
    }
    public setSerialNumber(serialNumber:string):void{
        this.serialNumber = serialNumber
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
    public getDeviceState():DeviceState{
        return this.deviceState
    }
    public setDeviceState(s:DeviceState):void{
        this.deviceState = s
    }
    public getTwinState():TwinState{
        return this.twinState
    }
    public setTwinState(s:TwinState):void{
        this.twinState = s
    }
    public getLightStatus():boolean{
        return this.lightStatus
    }
    public getLastHeartBeat():IHeartBeat{
        return this.heartBeat
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
    public getSerialNumber():string{
        return this.serialNumber
    }

}

export { Twin, DeviceState }