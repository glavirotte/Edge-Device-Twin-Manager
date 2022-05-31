/*#######################################################  

An instance of this class linked with a specific twin will 
be called when the user interrcats with the twin proxy

#########################################################*/

import { DeviceManager } from "./DeviceManager";
import { Task } from "./Task";
import { State, Twin } from "./Twin";

class TwinHandler extends Object{

    deviceManager:DeviceManager

    constructor(deviceManager:DeviceManager){
        super()
        this.deviceManager = deviceManager
    }

    // Handler to control object via Proxy. The user interract via the proxy
    get(twin:Twin, prop:string) {              // Called when the user access a field of the twin to get its value
        type ObjectKey = keyof typeof twin;
        const property = prop as ObjectKey;
        console.log(`Getting property ${prop} from ${twin.getID()}`)    // To be modified
        // Remember to so the default operation, returning the prop item inside obj
        return twin[property]
    }

    set(twin:Twin, prop:string, value:any) {    //  Called when the user wants to set the value of a field
        type ObjectKey = keyof typeof twin;
        const property = prop as ObjectKey;
        
        // @TODO Has to be improved

        if(prop === "proxySwitchLight"){
            this.deviceManager.getDevice(twin)?.switchLight()
                .then((response) => {
                    if(response !== undefined ){
                        this.deviceManager.updateDeviceTwin(twin, response)
                    }else{
                        console.log("Error in switch light ! -> Device unreachable")      // If camera is currently unreachable
                        twin.setState(State.OFFLINE)
                        const task = new Task(new Array(), "switchLight")  // We create a task and save it into the taskQueue of the twin
                        twin.getTaskQueue().addTask(task)
                }})
        }

        /*
            Set method must return a value.
            Return `true` to indicate that assignment succeeded
            Return `false` (even a falsy value) to prevent assignment.in `strict mode`, returning false will throw TypeError
        */
        return true
    }
}

export{ TwinHandler }