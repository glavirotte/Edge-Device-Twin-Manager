interface IConfigurableProperties{
    list:(string)[]
}
const twinConfigurableProperties = {
    list:[
        "applications",
        "lightStatus",
        "mqttClientStatus",
        "mqttEventConfig",
        "firmware"
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
        // console.log("Setting property:", property,"of target:", target, "to:", value)
        this.twinConfigurableProperties.list.forEach(prop => {
            if(property === prop){
                target[property] = value;
                this.synchronizerCallback(this.getTwinReference, property, value)
            }
        });

        return true
    }
}

export { TwinPropertiesHandler }