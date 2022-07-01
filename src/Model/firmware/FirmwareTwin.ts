/*#######################################################  

This class describes the firmware object which is given
to the agent by the synchronizer and will be uploaded. 

#########################################################*/
import { FirmwareTwinProperties } from "./FirmwareTwinProperties"

const resources = "./resources/"

class FirmwareTwin{
    
    public reported:FirmwareTwinProperties
    public desired:FirmwareTwinProperties

    public constructor (properties:FirmwareTwinProperties){
        this.reported = properties
        this.desired = properties
    }

/*------------------ Getters & Setters ------------------------ */
    public getFile():string{
        return resources+this.reported.fileName
    }
}

export { FirmwareTwin }