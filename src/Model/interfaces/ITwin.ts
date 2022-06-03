import { ApplicationEntity, IResponse } from "./IResponse"

enum State {
    OFFLINE,
    ONLINE,
}

interface ITwin {
    updateState(response: IResponse):string

    getApplications():(ApplicationEntity)[] | null

    getID():string

    setIPAddress(ipAddress:string):void

    getLastSeen():number

    setLastSeen(timeStamp:number):void

    getLastEntry():number

    setLastEntry(timeStamp:number):void

    getState():State

    setState(s:State):void

    getLightStatus():boolean

    setLightStatus(newLightStatus:boolean):void

    switchLight():void

}

export { ITwin, State }
