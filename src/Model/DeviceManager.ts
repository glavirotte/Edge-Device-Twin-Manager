/*#######################################################  

This class describes the Device Manager resect, which is
used to update the state of the Device twin and to interact
with the physical device

#########################################################*/

import { Device } from "./Device"
import { IResponse } from "./interfaces/IResponse"
import { State, Twin } from "./Twin"
import { TwinHandler } from "./TwinHandler"
import { Task } from "./Task"

const defautlUsername = 'root'
const defaultPassword = 'pass'
var date = ""
// date = "06/03/2022 16:01:00"

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
    public async createTwin(ipAddress:string):Promise<Twin>{
        const deviceTwin = new Twin(ipAddress, this)
        const device = new Device(ipAddress)
        this.devices.set(device, deviceTwin)
        device.setLoginCredentials(defautlUsername, defaultPassword)    // Give default login and password to the device resect
        
        const getDeviceInfo = new Task(device, device.getDeviceInfo, new Array(), date)
        getDeviceInfo.execute()
            .then(response => {
                this.handleRespone(deviceTwin, response, getDeviceInfo)
                device.setID(deviceTwin.getID())
            })
        
        const getLightStatus = new Task(device, device.getLightStatus, new Array(), date)
        getLightStatus.execute() // @TODO will be removed in a futur implementation
            .then(response => {     // Get camera light status
                this.handleRespone(deviceTwin, response, getLightStatus)
            })
        
        const listApplications = new Task(device, device.listApplications, new Array(), date)
        listApplications.execute()      //Get the list of applications
            .then(response => {
                this.handleRespone(deviceTwin, response, listApplications)
            })

        await this.checkDeviceConnectivity(deviceTwin, 5000)  // Check every 5s the connection with the device
        const twinProxy = new Proxy(deviceTwin, new TwinHandler(this))   // Create a proxy to trigger event from the user interraction and apply them to the twin and device
        this.proxies.set(twinProxy, deviceTwin)

        return twinProxy
    }

    // Update state of the twin, called after a device API request
    public updateDeviceTwin(twin:Twin, response:IResponse){
        twin.updateState(response)
    }

    public handleRespone(twin:Twin, response:IResponse| undefined, task:Task){
        if(response !== undefined){
            this.updateDeviceTwin(twin, response)
        }else{
            twin.setState(State.OFFLINE)
            twin.getTaskQueue().addTask(task)
        }
    }


    // Send a http request every {{ ms }} second to check connectivity with device
    private async checkDeviceConnectivity(twin:Twin, ms:number){
        const device = this.getDevice(twin)

        if(device !== undefined){
            setInterval(async () => {
                const res = await device.ping()     // Send "ping" request and wait for the result status code
                const timestamp = Date.now()        // get current timestamp
                if(res === 200){
                    twin.setState(State.ONLINE)  // Update State
                    console.log(twin.getID() + " is connected ! Lastseen:", timestamp - twin.getLastSeen(), "s ago", ", LastEntry: ", timestamp - twin.getLastEntry(), "s ago")
                    
                    if(timestamp - twin.getLastSeen() > 2*ms){  // If device was disconnected and is online again
                        twin.setLastEntry(timestamp)    // Update last entry with current timestamp

                        // Perform the tasks present in the task queue of the twin
                        const taskQueue = twin.getTaskQueue()
                        const numberOfTasks = taskQueue.getArrayLength()

                        for (let index = 0; index < numberOfTasks; index++) {
                            const task = taskQueue.getNextTask()
                            if(task !== undefined){
                                const res = await task.execute()
                                if(res !== undefined){
                                    this.updateDeviceTwin(twin, res)
                                }
                            }
                        }
                    }
                    
                    twin.setLastSeen(timestamp)     // Update last seen with current timestamp
                    
                }else{
                    console.log(twin.getID() + " is offline ! Lastseen:", timestamp - twin.getLastSeen(), "s ago", ", LastEntry: ", timestamp - twin.getLastEntry(), "s ago")
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