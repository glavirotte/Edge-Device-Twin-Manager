import { ApplicationEntity, IResponse } from "./IResponse"

enum DeviceState {
    OFFLINE,
    ONLINE,
}

interface ITwin {
    updateState(response: IResponse):void

    getApplications():(ApplicationEntity)[] | null

    getID():string

    setIPAddress(ipAddress:string):void

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

export { ITwin, DeviceState }
