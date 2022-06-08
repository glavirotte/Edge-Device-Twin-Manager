/*#######################################################  

An instance of this class linked with a specific twin will 
be called when the user interrcats with the twin proxy

#########################################################*/

import { Agent } from "./Agent"
import { Synchronizer } from "./Synchronizer"
import { IResponse } from "./interfaces/IResponse"
import { Task } from "./Task"
import { Twin } from "./Twin"

class TwinHandler extends Object{

    synchronizer:Synchronizer

    constructor(synchronizer:Synchronizer){
        super()
        this.synchronizer = synchronizer
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
        
        const agent = this.synchronizer.getAgent(twin) as Agent
        const properties = Object.getOwnPropertyNames(Object.getPrototypeOf(agent))

        for(var i = 0; i < properties.length; i++){
            if(prop === "proxy"+properties[i]){
                const method = agent[properties[i] as keyof Agent] as Function
                twin.getTaskManager().registerTask(new Task(agent, method, new Array(),  ""))
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