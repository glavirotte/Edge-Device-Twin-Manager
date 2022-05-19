import { Device } from "./Device"
import { Twin } from "./Twin"

const username = 'root'
const password = 'root'

class DeviceManager {
    
    username:string
    password:string
    devices:Map<Device, Twin>

    constructor(){
        this.username = username
        this.password = password
        this.devices = new Map()
    }

    registerDevice(device:Device){
        const deviceTwin = new Twin(device)
        this.devices.set(device, deviceTwin)
        device.setLoginCredentials(username, password)
    }

/*------------------ Getters & Setters ------------------------ */

    getDevice(id:string):void | Device{
        for (let [device, twin] of this.devices) {
            if(device.getID() == id){
                return device
            }
        }
        throw(Error('No registered device has this id !'))
    }
    getUsername(){
        return this.username
    }
    getPassword(){
        return this.password
    }
}

export { DeviceManager }