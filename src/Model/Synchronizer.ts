/*#######################################################  

This class describes the Device Manager resect, which is
used to update the state of the Device twin and to interact
with the physical device

#########################################################*/

import { Agent } from "./Agent"
import { IResponse } from "./interfaces/IResponse"
import { DeviceState, Twin } from "./Twin"
import { TwinHandler } from "./TwinHandler"
import { Task, TaskState } from "./Task"
import { Routine } from "./Routine"

const defautlUsername = 'root'
const defaultPassword = 'pass'

class Synchronizer {
    
    private agents:Map<Agent, Twin>
    private twins:Map<string, Twin>
    private proxies:Map<any, Twin>

    public constructor(){
        this.agents = new Map()
        this.twins = new Map()
        this.proxies = new Map()
    }

    // Create a twin, setup it and return a twin proxy for the user to be able to interract with it
    public async createTwin(ipAddress:string):Promise<Twin>{
        const deviceTwin = new Twin(ipAddress)
        const agent = new Agent(ipAddress)
        this.agents.set(agent, deviceTwin)
        agent.setLoginCredentials(defautlUsername, defaultPassword)    // Give default login and password to the device resect
        var date = ""
        date = "06/07/2022 11:25:00"    //@TODO Just for testing 

        const getDeviceInfo = new Task(agent, agent.getDeviceInfo, new Array(), date)
        await deviceTwin.getTaskManager().registerTask(getDeviceInfo)
            .then(response => {
                this.handleRespone(deviceTwin, response, getDeviceInfo)
            })

        const routine = new Routine(date)
        routine.setDate(date)
        const getLightStatus = new Task(agent, agent.getLightStatus, new Array(), date)        
        const listApplications = new Task(agent, agent.listApplications, new Array(), date)
        routine.addTask(getLightStatus)
        routine.addTask(listApplications)
        const responses:IResponse | undefined [] = await deviceTwin.getTaskManager().registerRoutine(routine)
        responses.forEach((response:IResponse | undefined) => {
            this.handleRespone(deviceTwin, response, routine.getResultTaskMap().get(response))
        });

        await this.checkDeviceConnectivity(deviceTwin, 5000)  // Check every 5s the connection with the device
        const twinProxy = new Proxy(deviceTwin, new TwinHandler(this))   // Create a proxy to trigger event from the user interraction and apply them to the twin and device
        this.proxies.set(twinProxy, deviceTwin)

        return twinProxy
    }

    // Update state of the twin, called after a device API request
    public updateDeviceTwin(twin:Twin, response:IResponse){
        twin.updateState(response)
    }

    // If response is not undefined, we synchronize the twin, otherwise we add task to twin task queue and twin is set to offline
    public handleRespone(twin:Twin, response:IResponse| undefined, task:Task | undefined){
        if(response !== undefined){
            this.updateDeviceTwin(twin, response)
        }else if(task !== undefined){
            twin.setState(DeviceState.OFFLINE)
            task.setState(TaskState.WAITING)
        }else{
            throw new Error("Task is undefined ! Cannot add it to task queue")
        }
    }


    // Send a http request every {{ ms }} second to check connectivity with device
    private async checkDeviceConnectivity(twin:Twin, ms:number){
        const agent = this.getAgent(twin)

        if(agent !== undefined){
            setInterval(async () => {
                const res = await agent.ping()     // Send "ping" request and wait for the result status code
                const timestamp = Date.now()        // get current timestamp
                if(res === 200){
                    twin.setState(DeviceState.ONLINE)  // Update State
                    console.log(twin.getID() + " is connected ! Lastseen:", timestamp - twin.getLastSeen(), "s ago", ", LastEntry: ", timestamp - twin.getLastEntry(), "s ago")
                    if(timestamp - twin.getLastSeen() > 2*ms){  // If device was disconnected and is online again
                        twin.setLastEntry(timestamp)    // Update last entry with current timestamp

                        // Perform the tasks present in the task queue of the twin
                        const taskManager = twin.getTaskManager()
                        const responses = await taskManager.executeTasksInWaitingQueue()
                        responses.forEach(response => {
                            if(response !== undefined){
                                this.updateDeviceTwin(twin, response)
                            }
                        });

                    }
                    
                    twin.setLastSeen(timestamp)     // Update last seen with current timestamp
                    
                }else{
                    console.log(twin.getID() + " is offline ! Lastseen:", timestamp - twin.getLastSeen(), "s ago", ", LastEntry: ", timestamp - twin.getLastEntry(), "s ago")
                    twin.setState(DeviceState.OFFLINE)    // Update state
                }
            }, ms)
        }
    }

/*------------------ Getters & Setters ------------------------ */

    public getAgent(deviceTwin:Twin):Agent | undefined{
        for (let [agent, twin] of this.agents) {
            if(twin === deviceTwin){
                return agent
            }
        }
        throw(Error('No registered device for that twin !'))
    }
    public getTwin(id:string):void | Twin{
        return this.twins.get(id)
    }
}

export { Synchronizer }