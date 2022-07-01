import { IFirmwareInfo } from "../interfaces/IFirmwareInfo"


class FirmwareTwinProperties implements IFirmwareInfo{
    
    activeFirmwareVersion: string
    activeFirmwarePart: string
    inactiveFirmwareVersion: string
    isCommitted: boolean
    lastUpgradeAt: string
    fileName:string

    constructor(activeFirmwareVersion:string, activeFirmwarePart:string,
       inactiveFirmwareVersion:string,isCommitted:boolean,lastUpgradeAt:string,
       fileName:string){
        
        this.activeFirmwareVersion = activeFirmwareVersion
        this.activeFirmwarePart = activeFirmwarePart
        this.inactiveFirmwareVersion = inactiveFirmwareVersion
        this.isCommitted = isCommitted
        this.lastUpgradeAt = lastUpgradeAt
        this.fileName = fileName
    }

}

export { FirmwareTwinProperties } 