import { ApplicationTwin } from "../application/ApplicationTwin"
import { FirmwareTwin } from "../firmware/FirmwareTwin"
import { Request } from "../Request"
import { IResponse } from "./IResponse"

interface IAgent{

    getProxyUrl():Promise<boolean | undefined>

    ping():void

    getDeviceInfo():Promise<IResponse | undefined>

    listApplications():Promise<IResponse | undefined>

    installApplication(arg:ApplicationTwin[]):Promise<IResponse | undefined>

    controlApplication(arg:(ApplicationTwin | string)[]):Promise<IResponse | undefined>

    getLightStatus():Promise<IResponse | undefined>

    switchLight():Promise<IResponse | undefined>

    getFirmwareStatus():Promise<IResponse | undefined>

    upgradeFirmware(arg:FirmwareTwin[]):Promise<IResponse | undefined>

    rollBack():Promise<IResponse | undefined>

    factoryDefault():Promise<IResponse | undefined>

    reboot():Promise<IResponse | undefined>

    getMqttClientStatus():Promise<IResponse | undefined>

    activateMqttClient():Promise<IResponse | undefined>

    deactivateMqttClient():Promise<IResponse | undefined>

    configureMqttClient(arg:string[]):Promise<IResponse | undefined>

    getMqttEventConfiguration():Promise<IResponse | undefined>

    configureMqttEvent(arg:(string | Object[])[]):Promise<IResponse | undefined>

    getCameraID():string

    setLoginCredentials(username:string, password:string):void
}
 



export { IAgent }