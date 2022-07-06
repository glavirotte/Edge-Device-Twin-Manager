import { time } from "console"
import {toTimestamp} from "../Utils"

interface IConfigurableProperties{
    list:(string)[]
}
const twinConfigurableProperties = {
    list:[
        "applications",
        "lightStatus",
        "mqttClientStatus",
        "mqttEventConfig",
        "firmware",
        "effectivityDate"
    ]
}

class TwinPropertiesHandler{

    private synchronizerCallback:Function
    private getTwinReference:Function
    private twinConfigurableProperties:IConfigurableProperties

    constructor(synchronizerCallback:Function, getTwinReference:Function){
        this.synchronizerCallback = synchronizerCallback
        this.getTwinReference = getTwinReference
        this.twinConfigurableProperties = twinConfigurableProperties
    }

    get(target:any, property:string) {
        // console.log("Try to access property:", property)
        if (property === 'toJSON') {
            return () => (target)
        }
        return target[property]
    }

    set(target:any, property:string, value:any) {
        let dateHasChanged = false
        if(property === "effectivityDate"){
            const timestamp = value === '' ? 1 : toTimestamp(value)
            if(timestamp !== 0){    // Check if the date entered by the user follows the right format
                target[property] = value
                dateHasChanged = true
            }else{
               console.log("Try to change a date to an incorrect format ! Right format: 'MM/DD/YYYY hh:mm:ss'")
            }
        }
        this.twinConfigurableProperties.list.forEach(prop => {
            if(property === prop && !dateHasChanged){
                target[property] = value;
                this.synchronizerCallback(this.getTwinReference, property, value)
            }
        });

        return true
    }
}

export { TwinPropertiesHandler }