/*#######################################################  

This class describes the Device Manager object which is
used to update the state of the Device twin and to interact
with the physical device

#########################################################*/

import { Device } from "./Device"
import { IResponse } from "./interfaces/IResponse"
import { Twin } from "./Twin"

const username = 'root'
const password = 'root'

class DeviceManager {
    
    private username:string
    private password:string
    private devices:Map<Device, Twin>

    public constructor(){
        this.username = username
        this.password = password
        this.devices = new Map()
    }

    // Add a device in the hashmap of Device/Twin and set login credentials to access device
    public registerDevice(device:Device){
        const deviceTwin = new Twin(device.getID())
        this.devices.set(device, deviceTwin)
        device.setLoginCredentials(username, password)
        device.setDeviceManager(this)
    }

    // Update state of the twin, called after a device API request
    public updateDeviceTwin(device:Device, response:IResponse){
        const twin = this.devices.get(device)
        twin?.updateState(response)
    }

/*------------------ Getters & Setters ------------------------ */

    public getDevice(id:string):void | Device{
        for (let [device, twin] of this.devices) {
            if(device.getID() == id){
                return device
            }
        }
        throw(Error('No registered device has this id !'))
    }
    public getTwin(device:Device):void | Device{
        this.devices.get(device)
    }
    public getUsername(){
        return this.username
    }
    public getPassword(){
        return this.password
    }
}

export { DeviceManager }