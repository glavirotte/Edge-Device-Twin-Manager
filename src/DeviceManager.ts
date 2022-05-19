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

    public registerDevice(device:Device){
        const deviceTwin = new Twin(device)
        this.devices.set(device, deviceTwin)
        device.setLoginCredentials(username, password)
        device.setDeviceManager(this)
    }

    public updateDeviceTwin(device:Device, data:IResponse){
        const twin = this.devices.get(device)
        twin?.updateApplicationList(data)
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
    public getUsername(){
        return this.username
    }
    public getPassword(){
        return this.password
    }
}

export { DeviceManager }