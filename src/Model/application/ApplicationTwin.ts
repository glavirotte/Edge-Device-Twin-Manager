/*#######################################################  

This class describes the Application object which is given
to the agent by the synchronizer and will be uploaded. 

#########################################################*/

import { IApplication } from "../interfaces/IResponse"
import {ApplicationTwinProperties} from "./ApplicationTwinProperties"
import fs from "fs"

const resourceFolder = "./resources/"
const repositoryURL = "https://"

class ApplicationTwin{
    
    // Where the source file is located (.eap) it can be on the fs or remotely
    reported: ApplicationTwinProperties
    desired:ApplicationTwinProperties

    public constructor (properties:IApplication){
        this.reported = new ApplicationTwinProperties()
        this.reported = properties
        this.desired = new ApplicationTwinProperties()
        this.desired = properties
    }

    public sync(reported:ApplicationTwinProperties){
        this.reported = reported
        this.desired = reported
        this.desired.FileName = ""
    }   

    private async download(url:string, fileName:string|undefined){  
            const res = await fetch(url);
            fs.writeFileSync(resourceFolder+fileName, res.body.toString());
            return true
    }
/*------------------ Getters & Setters ------------------------ */

    public getName(){
        return this.reported.Name
    }

    public async getFile(){
        let fileExist = false
        try {
            fileExist = fs.lstatSync(resourceFolder+this.desired.FileName).isFile() 
        }catch(err) {
              fileExist = false
        }finally{
            if(fileExist){
                return resourceFolder+this.desired.FileName
            }else{
                try {
                    await this.download(repositoryURL, this.desired.FileName)
                    return resourceFolder+this.desired.FileName
                } catch (error) {
                    throw new Error("Desired file is not in local file system and could not fetch it from "+repositoryURL+" !")
                }
            }
        }
    }

}

export { ApplicationTwin }