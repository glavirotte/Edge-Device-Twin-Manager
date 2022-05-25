/*#######################################################  

This class describes the Device Manager object, which is
used to update the state of the Device twin and to interact
with the physical device

#########################################################*/

import { Device } from "./Device"
import { IResponse } from "./interfaces/IResponse"
import { State, Twin } from "./Twin"
import { TwinHandler } from "./TwinHandler"

const defautlUsername = 'root'
const defaultPassword = 'pass'

class DeviceManager {
    
    private devices:Map<Device, Twin>
    private twins:Map<string, Twin>
    private proxies:Map<any, Twin>

    public constructor(){
        this.devices = new Map()
        this.twins = new Map()
        this.proxies = new Map()
    }

    // Create a twin, setup it and return a twin proxy for the user to be able to interract with it
    public async createTwin(ipAddress:string):Promise<any>{
        const deviceTwin = new Twin(ipAddress, this)
        const device = new Device(ipAddress)
        this.devices.set(device, deviceTwin)

        device.setLoginCredentials(defautlUsername, defaultPassword)    // Give default login and password to the device object
        
        await device.getDeviceInfo()      // get the response from the device
            .then(response => {
                if(response !== undefined){
                    this.updateDeviceTwin(device, response)         // Update the twin properties
                    device.setID(deviceTwin.getID())                // set the id of of the device object
                    this.twins.set(deviceTwin.getID(), deviceTwin)
                }else{
                    deviceTwin.setState(State.OFFLINE)
                    // @TODO create a new task to perform later
                }
            })
        
        await device.getLightStatus() // @TODO will be removed in a futur implementation
            .then(lightStatus => {     // Get camera light status
                if(lightStatus !== undefined){
                    deviceTwin.setLightStatus(lightStatus)
                }else{
                    deviceTwin.setState(State.OFFLINE)
                    // @TODO create a new task to perform later
                }
            })

        await device.listApplications()      //Get the list of applications
            .then(response => {
                if(response !== undefined){
                    this.updateDeviceTwin(device, response)
                }else{
                    deviceTwin.setState(State.OFFLINE)
                    // @TODO create a new task to perform later
                }
            })
        
        await this.checkDeviceConnectivity(deviceTwin, 5000)  // Check every 5s the connection with the device
        deviceTwin.storeTwinObject()
        const twinProxy = new Proxy(deviceTwin, new TwinHandler(this))   // Create a proxy to trigger event from the user interraction and apply them to the twin and device
        this.proxies.set(twinProxy, deviceTwin)

        return twinProxy
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

    // Send a http request every {{ ms }} second to check connectivity with device
    private async checkDeviceConnectivity(twin:Twin, ms:number){
        const device = this.getDevice(twin)

        if(device !== undefined){
            setInterval(async () => {
                const res = await device.ping()     // Send "ping" request and wait for the result status code
                const timeStamp = Date.now()        // get current timestamp
                if(res === 200){
                    twin.setState(State.ONLINE)  // Update State
                    console.log(twin.getID() + " is connected ! Lastseen:", timeStamp - twin.getLastSeen(), "s ago", ", LastEntry: ", timeStamp - twin.getLastEntry(), "s ago")
                    
                    if(timeStamp - twin.getLastSeen() > 2*ms){  // If device has been disconnected
                        twin.setLastEntry(timeStamp)    // Update last entry with current timestamp
                    }
                    twin.setLastSeen(timeStamp)     // Update last seen with current timestamp
                    
                }else{
                    console.log(twin.getID() + " is offline ! Lastseen:", timeStamp - twin.getLastSeen(), "s ago", ", LastEntry: ", timeStamp - twin.getLastEntry(), "s ago")
                    twin.setState(State.OFFLINE)    // Update state
                }
            }, ms)
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
    public getTwin(id:string):void | Twin{
        return this.twins.get(id)
    }
}

export { DeviceManager }