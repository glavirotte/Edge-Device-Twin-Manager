import { ApplicationTwin } from "../Application"
import { IResponse } from "./IResponse"
import { IURIs } from "./IURIs"
import { Request } from "../Request"

export interface IDevice {
    
    askDevice(req: Request):Promise<IResponse | undefined>

    ping():void

    getDeviceInfo():Promise<IResponse | undefined>

    listApplications():Promise<IResponse | undefined>

    installApplication(application:ApplicationTwin):Promise<IResponse | undefined>

    removeApplication(application:ApplicationTwin):Promise<IResponse | undefined>

    getLightStatus():Promise<IResponse | undefined>

    switchLight(wishedStatus:boolean):Promise<IResponse | undefined>

    getID(): string

    getIPAddress():string

    setLoginCredentials(username:string, password:string):void

    setID(id:string):void
}