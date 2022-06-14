import { ApplicationEntity, IResponse } from "./IResponse"

enum DeviceState {
    OFFLINE,
    ONLINE,
}

enum TwinState {
    UPTODATE,
    OUTDATED,
}

interface ITwin {
    updateState(response: IResponse):void

    getApplications():(ApplicationEntity)[] | null

    getID():string

    setSerialNumber(serialNumber:string):void

    getLastSeen():number

    setLastSeen(timeStamp:number):void

    getLastEntry():number

    setLastEntry(timeStamp:number):void

    getState():DeviceState

    setState(s:DeviceState):void

    getLightStatus():boolean

    setLightStatus(newLightStatus:boolean):void

    switchLight():void

}

export { ITwin, DeviceState, TwinState}