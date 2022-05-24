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

    // Add a device in the hashmap of Device/Twin and set login credentials to access device

    public async registerDevice(device:Device){
        if(!this.devices.has(device)){
            const deviceTwin = new Twin(this)           // Create the device twin
            this.devices.set(device, deviceTwin)        // Add device/twin pair in the hashmap
            device.setLoginCredentials(defautlUsername, defaultPassword)    // Give default login and password to the device object
            device.getDeviceInfo()      // get the response from the device
                .then(response => {
                    if(response !== undefined){
                        this.updateDeviceTwin(device, response)         // Update the twin properties
                        deviceTwin.setIPAddress(device.getIPAddress())  // store ipAddress in the deviceTwin
                        device.setID(deviceTwin.getID())                // set the id of of the device object
                    }
                })

            device.listApplications()
                .then(response => {if(response !== undefined) {this.updateDeviceTwin(device, response)}})

            // const app:Application = new Application("loiteringguard", "../App_dev/Loitering_Guard/AXIS_Loitering_Guard_2_3_2.eap")
            // device.installApplication(app)
            //     .then(response => {if(response !== undefined) {this.updateDeviceTwin(device, response)}})
        }
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

/*------------------ Getters & Setters ------------------------ */

    public getDevice(id:string):Device | undefined{
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
}

export { DeviceManager }