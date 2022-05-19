/*#######################################################  

This class represent the current known state of the Device
with the applications installed 

#########################################################*/

import { Device } from "./Device";

class Twin {

    json:JSON
    device:Device

    constructor(device:Device){
        this.device = device
        this.json = JSON.parse('{}')
    }

    getTwin(){
        return this.json
    }
}

export { Twin }