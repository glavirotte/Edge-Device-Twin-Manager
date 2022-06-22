import { TwinProperties } from "./TwinProperties";

class DesiredPropertiesHandler{

    private synchronizerCallback:Function
    private getTwinReference:Function

    constructor(synchronizerCallback:Function, getTwinReference:Function){
        this.synchronizerCallback = synchronizerCallback
        this.getTwinReference = getTwinReference
    }

    get(target:any, property:string) {
        // console.log("Try to access property:", property)
        if (property === 'toJSON') {
            // console.log("ToJson() method called")
            return () => (target)
        }
        return target[property]
    }

    set(target:any, property:string, value:any) {
        // console.log("Setting property:", property,"of target:", target, "to:", value)
        target[property] = value;
        this.synchronizerCallback(this.getTwinReference, property, value)
        return true
    }
}

export { DesiredPropertiesHandler }