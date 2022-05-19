/*#######################################################  

This class represent the current known state of the Device
with the applications installed 

#########################################################*/

import { Device } from "./Device";

class Twin {

    private json:JSON
    private device:Device

    public constructor(device:Device){
        this.device = device
        this.json = JSON.parse('{}')
    }

    public getTwin(){
        return this.json
    }
}

export { Twin }