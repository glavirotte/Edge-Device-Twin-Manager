import { Application } from "../Application"
import { IResponse } from "./IResponse"
import { IURIs } from "./IURIs"
import { Request } from "../Request"

export interface IDevice {
    
    askDevice(req: Request):Promise<IResponse | undefined>

    ping():void

    getDeviceInfo():Promise<IResponse | undefined>

    listApplications():Promise<IResponse | undefined>

    installApplication(application:Application):Promise<IResponse | undefined>

    removeApplication(application:Application):Promise<IResponse | undefined>

    getLightStatus():Promise<boolean | undefined>

    switchLight(wishedStatus:boolean):Promise<boolean | undefined>

    getID(): string

    getIPAddress():string

    setLoginCredentials(username:string, password:string):void

    setID(id:string):void
}