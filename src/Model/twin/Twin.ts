/*#######################################################  
This class represent the current known state of the Device
with the applications installed 
#########################################################*/

import { IHeartBeat, IHeartBeatAppMessage } from "../interfaces/IHeartBeat"
import { IResponse, IApplication, } from "../interfaces/IResponse"
import { DeviceState, TwinState } from "../interfaces/ITwin"
import { writeJSON } from "../Utils"
import {IMQTTClientStatus} from "../interfaces/IMQTTClientStatus"
import {EventFilterListEntity, EventPublicationConfig, IMQTTEventConfig} from "../interfaces/IMQTTEventConfig"
import ini from "ini"
import { ICommon } from "../interfaces/ICommon"
import { TwinProperties } from "./TwinProperties"
import { TwinPropertiesHandler } from "./DesiredPropertiesHandler"
import { ApplicationTwin } from "../application/ApplicationTwin"
import { FirmwareTwin } from "../firmware/FirmwareTwin"
import { FirmwareTwinProperties } from "../firmware/FirmwareTwinProperties"

class Twin{
    public _id?:string
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
    public updateState(response: IResponse | undefined , heartBeat:IHeartBeat | undefined){
        try {
            if(response !== undefined){     // Synchronization with device properties
                if(response?.data?.propertyList !== undefined){
                    this.reported.deviceProperties = response?.data?.propertyList
                    this.reported.serialNumber = this.reported.deviceProperties.SerialNumber
                }
                if(response?.reply?.application?.[0].$ !== undefined){  // Synchronization with device applications
                    const newApps =  new Array<ApplicationTwin>()
                    response?.reply?.application.forEach(app => {
                            const appTwin:ApplicationTwin = new ApplicationTwin(app.$)
                            appTwin.sync(app.$)
                            newApps.push(appTwin)
                    });
                    this.reported.applications = newApps

                }
                if(response?.data?.status !== undefined && response.method === 'getLightStatus'){ // Synchronization with device light status
                    this.reported.lightStatus = response.data.status as boolean
                }
                if(response.data?.activeFirmwareVersion !== undefined){ // Synchronization with device firmware
                    const firmwareProps = new FirmwareTwinProperties(
                        response.data?.activeFirmwareVersion, response.data?.activeFirmwarePart,
                        response.data?.inactiveFirmwareVersion, response.data?.isCommitted,
                        response.data?.lastUpgradeAt, "")
                    this.reported.firmware = new FirmwareTwin(firmwareProps)
                }
                // Synchronization with mqtt client
                if(response.data?.status !== undefined && (response.method === "getClientStatus" || response.method === "activateClient" || response.method === "deactivateClient")){
                    this.reported.mqttClientStatus = response.data?.status ? response.data as IMQTTClientStatus: {} as IMQTTClientStatus
                }
                // Synchronization with mqtt event configuration
                if(response.method === "getEventPublicationConfig"){
                    this.reported.mqttEventConfig = response.data as IMQTTEventConfig
                }
            // console.log(this.reported, "\n")
            }else if(heartBeat !== undefined){  // Synchronization via heartbeat
                this.reported.heartBeat = heartBeat

                // Synchronization of apps status
                if(heartBeat.message.data.Applications !== undefined){
                    const appMessage:IHeartBeatAppMessage = ini.parse(heartBeat.message.data.Applications) as IHeartBeatAppMessage
                    const applications = appMessage.applications.array
                    const status = appMessage.status.array

                    const reportedApplications = new Array<ApplicationTwin>()

                    for (let index = 0; index < applications.length; index++) {
                        status[index] = status[index].replace("ENABLED=", "").replace("no", "Stopped").replace("yes", "Running")
                        for(const app of this.reported.applications!){
                            if(app.reported.Name === applications[index]){
                                if(status[index] !== app.reported.Status && applications[index] !== "heartbeatv2"){ // Has to be fixed
                                    app.reported.Status = status[index]
                                }
                                reportedApplications.push(app)
                            }
                        }
                    }
                    this.reported.applications = reportedApplications     
                }
                // Synchronization of MQTT topics
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

    public contains(appTwin:ApplicationTwin){
        let bool:boolean = false
        if(this.reported.applications !== null){
            for (const app of this.reported.applications) {
                if(app.reported.Name === appTwin.desired.Name){
                    return bool = true
                }
            }
        }
        return bool
    }

/*------------------ Getters & Setters ------------------------ */

    public getApplications():(ApplicationTwin)[] | null{
        return this.reported.applications
    }
    public getAppTwin(name:string):ApplicationTwin | null{
        if(this.reported.applications !== null){
            for (const app of this.reported.applications) {
                if(app.reported.Name === name){
                    return app
                }
            }
        }
        return null
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