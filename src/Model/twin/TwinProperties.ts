import { PropertyList } from "../interfaces/IResponse"
import { DeviceState, TwinState } from "../interfaces/ITwin"
import {IFirmwareInfo} from "../interfaces/IFirmwareInfo"
import { IMQTTClientStatus } from "../interfaces/IMQTTClientStatus"
import { IMQTTEventConfig } from "../interfaces/IMQTTEventConfig"
import { IHeartBeat } from "../interfaces/IHeartBeat"
import { ApplicationTwin } from "../application/ApplicationTwin"

class TwinProperties{

    id:string
    serialNumber:string
    deviceProperties: PropertyList | undefined
    applications: (ApplicationTwin)[] | null
    lastseen:number     // last time the device was online
    lastentry:number    // last time the device start connection with the system
    deviceState:DeviceState         // Current known state of the device
    twinState:TwinState
    firmwareInfo: IFirmwareInfo
    mqttClientStatus:IMQTTClientStatus
    mqttEventConfig:IMQTTEventConfig
    lightStatus:boolean
    heartBeat: IHeartBeat

    public constructor(id:string){
        this.id = id
        this.serialNumber = {} as string
        this.deviceProperties = {} as PropertyList | undefined
        this.applications = new Array<ApplicationTwin>()
        this.heartBeat = {} as IHeartBeat
        this.lastseen = 0
        this.lastentry = 0
        this.deviceState = DeviceState.UNREACHABLE
        this.twinState = TwinState.OUTDATED
        this.lightStatus = {} as boolean
        this.firmwareInfo = {} as IFirmwareInfo
        this.mqttClientStatus = {} as IMQTTClientStatus
        this.mqttEventConfig = {} as IMQTTEventConfig
    }
    
}
export { TwinProperties }