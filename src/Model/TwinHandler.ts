/*#######################################################  

An instance of this class linked with a specific twin will 
be called when the user interrcats with the twin proxy

#########################################################*/

import { Device } from "./Device";
import { DeviceManager } from "./DeviceManager";
import { IResponse } from "./interfaces/IResponse";
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
        
        const device = this.deviceManager.getDevice(twin) as Device
        const properties = Object.getOwnPropertyNames(Object.getPrototypeOf(device))

        for(var i = 0; i < properties.length; i++){
            if(prop === "proxy"+properties[i]){
                const method = device[properties[i] as keyof Device] as Function
                const boundFunction = method.bind(device)
                boundFunction()
                .then((response:IResponse) => {
                    if(response !== undefined ){
                        this.deviceManager.updateDeviceTwin(twin, response)
                    }else{
                        console.log("Error in " + properties[i] + " ! -> Device unreachable")      // If camera is currently unreachable
                        twin.setState(State.OFFLINE)
                        const device = this.deviceManager.getDevice(twin) as Device
                        twin.getTaskQueue().addTask(new Task(device, method, new Array(),  ""))  // We create a task and save it into the taskQueue of the twin
                }})
            }
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