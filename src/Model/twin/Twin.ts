/*#######################################################  
This class represent the current known state of the Device
with the applications installed 
#########################################################*/

import { IHeartBeat } from "../interfaces/IHeartBeat"
import { IResponse, IApplication, } from "../interfaces/IResponse"
import { DeviceState, TwinState } from "../interfaces/ITwin"
import { writeJSON } from "../Utils"
import {IMQTTClientStatus} from "../interfaces/IMQTTClientStatus"
import {EventFilterListEntity, EventPublicationConfig, IMQTTEventConfig} from "../interfaces/IMQTTEventConfig"
import ini from "ini"
import { ICommon } from "../interfaces/ICommon"
import { TwinProperties } from "./TwinProperties"
import { TwinPropertiesHandler } from "../DesiredPropertiesHandler"
import { ApplicationTwin } from "../application/ApplicationTwin"

class Twin{
    
    public reported:TwinProperties
    public desired:TwinProperties
    private synchronizerCallback:Function

    // The followings fields are used to handle changes via the proxy

    public constructor(id:string, synchronizerCallback:Function){
        this.reported = new TwinProperties(id)
        this.desired = new Proxy(new TwinProperties(id), new TwinPropertiesHandler(synchronizerCallback, this.getTwin.bind(this))) as TwinProperties
        this.synchronizerCallback = synchronizerCallback
    }

    // Update the state of the Twin by storing values from last request
    updateState(response: IResponse | undefined , heartBeat:IHeartBeat | undefined){
        try {
            if(response !== undefined){     // Synchronization with device properties
                if(response?.data?.propertyList !== undefined){
                    this.reported.deviceProperties = response?.data?.propertyList
                    this.reported.serialNumber = this.reported.deviceProperties.SerialNumber
                }
                if(response?.reply?.application?.[0].$ !== undefined){  // Synchronization with device applications
                    response?.reply?.application.forEach(app => {
                        if(this.reported.applications !== null){
                            const isStored = this.isAlreayStored(app.$)
                            if(isStored.status === true){
                                isStored.appStored.reported = app.$
                            }else{
                                const appTwin:ApplicationTwin = new ApplicationTwin(app.$.Name, "")
                                appTwin.sync(app.$)
                                this.reported.applications.push(appTwin)
                            }
                        }
                    });
                }
                if(response?.data?.status !== undefined && response.method === 'getLightStatus'){ // Synchronization with device light status
                    this.reported.lightStatus = response.data.status as boolean
                }
                if(response.data?.activeFirmwareVersion !== undefined){ // Synchronization with device firmware
                    this.reported.firmwareInfo.activeFirmwarePart = response.data?.activeFirmwarePart
                    this.reported.firmwareInfo.activeFirmwareVersion = response.data?.activeFirmwareVersion
                    this.reported.firmwareInfo.inactiveFirmwareVersion = response.data?.inactiveFirmwareVersion
                    this.reported.firmwareInfo.lastUpgradeAt = response.data?.lastUpgradeAt
                    this.reported.firmwareInfo.isCommitted = response.data?.isCommitted
                }
                // Synchronization with mqtt client
                if(response.data?.status !== undefined && (response.method === "getClientStatus" || response.method === "activateClient" || response.method === "deactivateClient")){
                    this.reported.mqttClientStatus = response.data?.status ? response.data as IMQTTClientStatus: {} as IMQTTClientStatus
                }
                // Synchronization with mqtt event configuration
                if(response.method === "getEventPublicationConfig"){
                    this.reported.mqttEventConfig = response.data as IMQTTEventConfig
                }
            console.log(this.reported, "\n")
            }else if(heartBeat !== undefined){  // Synchronization via heartbeat
                this.reported.heartBeat = heartBeat
                if(!heartBeat.message.data.Topics.startsWith("none")){
                    const topics = ini.parse(heartBeat.message.data.Topics)
                    const common = topics["common"]
    
                    if(this.reported.mqttEventConfig.eventPublicationConfig == undefined){
                        this.reported.mqttEventConfig.eventPublicationConfig = {} as EventPublicationConfig
                        this.reported.mqttEventConfig.eventPublicationConfig.common = {} as ICommon
                    }
                    this.reported.mqttEventConfig.eventPublicationConfig.common = common as ICommon
    
                    const eventFilterList:(EventFilterListEntity)[] = new Array()
                    for (const key of Object.keys(topics)){
                        if(key !== "common"){
                            eventFilterList.push(topics[key])
                        }
                    }
                    this.reported.mqttEventConfig.eventPublicationConfig.eventFilterList = eventFilterList
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
        writeJSON(this, `./src/Model/Data_Storage/Twins/${this.reported.serialNumber}-Twin.json`)
    }

    private isAlreayStored(app:IApplication){
        var status = false
        var appStored:ApplicationTwin = {} as ApplicationTwin
        if(this.reported.applications !== null){
            this.reported.applications.forEach(application => {
                if(app.Name === application.reported.Name){
                    status = true
                }
            });
        }
        return {'status':status, 'appStored':appStored}
    }

/*------------------ Getters & Setters ------------------------ */

    public getApplications():(ApplicationTwin)[] | null{
        return this.reported.applications
    }
    public getID():string{
        return this.reported.id
    }
    public setSerialNumber(serialNumber:string):void{
        this.reported.serialNumber = serialNumber
    }
    public getLastSeen():number{
        return this.reported.lastseen
    }
    public setLastSeen(timeStamp:number):void{
        this.reported.lastseen = timeStamp
    }
    public getLastEntry():number{
        return this.reported.lastentry
    }
    public setLastEntry(timeStamp:number):void{
        this.reported.lastentry = timeStamp
    }
    public getDeviceState():DeviceState{
        return this.reported.deviceState
    }
    public setDeviceState(s:DeviceState):void{
        this.reported.deviceState = s
    }
    public getTwinState():TwinState{
        return this.reported.twinState
    }
    public setTwinState(s:TwinState):void{
        this.reported.twinState = s
    }
    public getLightStatus():boolean{
        return this.reported.lightStatus
    }
    public getLastHeartBeat():IHeartBeat{
        return this.reported.heartBeat
    }
    public setLightStatus(status:boolean){
        this.reported.lightStatus = status
    }
    public getSerialNumber():string{
        return this.reported.serialNumber
    }
    public getTwin(){
        return this
    }

}

export { Twin, DeviceState }