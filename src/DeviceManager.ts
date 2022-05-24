/*#######################################################  

This class describes the Device Manager object, which is
used to update the state of the Device twin and to interact
with the physical device

#########################################################*/
import { Device } from "./Device"
import { IResponse } from "./interfaces/IResponse"
import { Twin } from "./Twin"
import { Application } from "./Application"

const defautlUsername = 'root'
const defaultPassword = 'pass'

class DeviceManager {
    
    private devices:Map<Device, Twin>

    public constructor(){
        this.devices = new Map()
    }

    // Add a device, twin pair in the hashmap of Device/Twin and set login credentials to access device

    public async createTwin(ipAddress:string){
        const deviceTwin = new Twin(ipAddress, this)
        const device = new Device(ipAddress)
        this.devices.set(device, deviceTwin)

        device.setLoginCredentials(defautlUsername, defaultPassword)    // Give default login and password to the device object
        device.getDeviceInfo()      // get the response from the device
            .then(response => {
                if(response !== undefined){
                    this.updateDeviceTwin(device, response)         // Update the twin properties
                    device.setID(deviceTwin.getID())                // set the id of of the device object
                }
            })

        device.listApplications()
            .then(response => {if(response !== undefined) {this.updateDeviceTwin(device, response)}})
        
        this.ensureDeviceConnectivity(deviceTwin)
    }

    // Update state of the twin, called after a device API request

    public updateDeviceTwin(device:Device, response:IResponse){
        const twin = this.devices.get(device)
        const id = twin?.updateState(response)
    }

    // Update state of device

    public updatePhysicalDevice(twin:Twin){
        let device:Device
        for (let [key, value] of this.devices.entries()) {
            if (Object.is(value, twin)){
                device = key
                device.setID(twin.getID())
                console.log(device)
                return
            }
        }
    }

    // Send a http request every 5s to check connectivity with device

    private async ensureDeviceConnectivity(twin:Twin){
        const device = this.getDevice(twin)

        if(device !== undefined){
            setInterval(async () => {
                const res = await device.ping()
                if(res === 200){
                    console.log("connected !")
                }else{
                    console.log("offline !")
                }
            },5000)
        }
    }

/*------------------ Getters & Setters ------------------------ */

    public getDevice(deviceTwin:Twin):Device | undefined{
        for (let [device, twin] of this.devices) {
            if(twin === deviceTwin){
                return device
            }
        }
        throw(Error('No registered device for that twin !'))
    }
    public getTwin(device:Device):void | Device{
        this.devices.get(device)
    }
}

export { DeviceManager }