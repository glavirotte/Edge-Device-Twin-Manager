/*#######################################################  
This class describes the Device Manager resect, which is
used to update the state of the Device twin and to interact
with the physical device
#########################################################*/

import { Agent } from "./Agent"
import { IResponse } from "./interfaces/IResponse"
import { DeviceState, Twin } from "./twin/Twin"
import { Task, TaskState } from "./task/Task"
import { Routine } from "./task/Routine"
import { TaskManager } from "./task/TaskManager"
import { FirmwareTwin } from "./firmware/FirmwareTwin"
import { ApplicationTwin } from "./application/ApplicationTwin"
import { IHeartBeat } from "./interfaces/IHeartBeat"
import { RoutineFactory } from "./task/RoutineFactory"
import { MongoAgent } from "./database/MongoAgent"
const HEART_BEAT_PERIOD = 60000

class Synchronizer {
    
    private agents:Map<Agent, Twin>
    private twins:Map<string, Twin>
    private proxies:Map<any, Twin>
    private taskManagers:Map<Twin, TaskManager>
    private subToMQTTTopic:Function
    private mongoAgent:MongoAgent

    public constructor(mongoAgent:MongoAgent){
        this.agents = new Map()
        this.twins = new Map()
        this.proxies = new Map()
        this.taskManagers = new Map()
        this.subToMQTTTopic = {} as Function
        this.mongoAgent = mongoAgent
        this.initSynchronizer()
    }

    private async initSynchronizer() {  // Restoring twins from database
        console.log("Restoring twins from database...")
        const storedTwinsID:Array<Twin> = await this.mongoAgent.find({}, {projection:{_id:0, reported:{id:1}}}, "Twins")
        this.mongoAgent.setStoredTwins(storedTwinsID)
        for (const result of storedTwinsID) {
            this.createTwin(result.reported.id)
        }

    }

    // Creates a twin, setup it and returns a twin proxy for the user to be able to interract with it
    public async createTwin(cameraID:string):Promise<Twin>{
        if(this.isDeviceAlreadyStored(cameraID)){
            throw new Error("Device "+cameraID+" already stored !")
        }
        const deviceTwin = new Twin(cameraID, this.handleTwinModification.bind(this))
        const agent = new Agent(cameraID)
        this.agents.set(agent, deviceTwin)

        // Getting the proxy url

        const proxyUrlResult:boolean| undefined = await agent.getProxyUrl()
        if(proxyUrlResult === true){
            await this.initialSynchronization(agent, deviceTwin)
            
        }else{
            console.log("Twin for device:", cameraID, "created but not setup. Device unreachable !")
        }

        // Insert the new twin in the database or update it if already stored
        this.mongoAgent.insert(deviceTwin, "Twins") 
        return deviceTwin
    }


    public async initialSynchronization(agent:Agent, deviceTwin:Twin){
        const taskManager = new TaskManager(deviceTwin)
        this.taskManagers.set(deviceTwin, taskManager)

        var date = ""
        date = "07/11/2022 15:17:00"    //@TODO Just for testing

        const getDeviceInfo = new Task(agent, agent.getDeviceInfo, new Array(), date)
        await taskManager.registerTask(getDeviceInfo, this.handleResponse)
        this.setTwin(deviceTwin)
        this.subToMQTTTopic("AXIS/"+deviceTwin.getSerialNumber()+"/Monitoring/HeartBeat") // subscribe to the heartbeat topic of the twin

        /* Routine to perform when a new twin is created */

        const routine = new Routine(date)
        routine.setDate(date)
        const getLightStatus = new Task(agent, agent.getLightStatus, new Array(), date)        
        const listApplications = new Task(agent, agent.listApplications, new Array(), date)
        const getFirmwareStatus =  new Task(agent, agent.getFirmwareStatus, [], date)
        // const reboot = new Task(agent, agent.reboot, [], date)
        // const upgradeFirmware = new Task(agent, agent.upgradeFirmware, [new Firmware("M1065-L_9_80_3_12", "/home/alphagone/Documents/Polytech/2021-2022/Stage/AXIS_Camera/App_dev/M1065-L_9_80_3_12.bin")], date)
        // const factoryDefault = new Task(agent, agent.factoryDefault, [], date)
        // const rollBack = new Task(agent, agent.rollBack, [], date)
        const getMqttStatus = new Task(agent, agent.getMqttClientStatus, new Array(), date)
        // const configureMqttClient = new Task(agent, agent.configureMqttClient, [deviceTwin.getSerialNumber(), {}], date)
        // const activateClient = new Task(agent, agent.activateMqttClient, [], date)
        // const configureMqttEvent = new Task(agent, agent.configureMqttEvent, [deviceTwin.getSerialNumber(), [{"topicFilter": "Monitoring/HeartBeat","qos": 1,"retain": "all"}]], date)
        // const getMqttEventConfiguration = new Task(agent, agent.getMqttEventConfiguration, [], date)

        routine.addTask(getLightStatus)
        routine.addTask(listApplications)
        // routine.addTask(installApplication)
        routine.addTask(getFirmwareStatus)
        // routine.addTask(reboot)
        // routine.addTask(controlApplication)
        // routine.addTask(upgradeFirmware)
        // routine.addTask(factoryDefault)
        // routine.addTask(rollBack)
        routine.addTask(getMqttStatus)
        // routine.addTask(configureMqttClient)
        // routine.addTask(activateClient)
        // routine.addTask(configureMqttEvent)
        // routine.addTask(getMqttEventConfiguration)

        taskManager.registerRoutine(routine, this.handleResponse)
    }

    public handleHeartBeat(twin:Twin, heartbeat:IHeartBeat){
        if(heartbeat !== undefined){
            twin.updateState(undefined, heartbeat)
        }else{
            throw new Error("HeartBeat is undefined ! Cannot synchronize with device")
        }
    }


    // If response is not undefined, we synchronize the twin, otherwise we add task to twin task queue and twin is set to offline
    public handleResponse(twin:Twin, response:IResponse | undefined, task:Task | undefined){
        if(response !== undefined){
            twin.updateState(response, undefined)
        }else if(task !== undefined){
            twin.setDeviceState(DeviceState.UNREACHABLE)
            task.setState(TaskState.WAITING)
        }
    }

    // Handle the message from the broker to get update the twin and ensure connection with the device
    public async handleMQTTBrokerMessage(topic:string, heartBeat:IHeartBeat){
        const twin = this.getTwin(heartBeat.serial)

        const timeout = 2*HEART_BEAT_PERIOD

        if(twin !== undefined){
            this.ensureDeviceConnectivity(twin, heartBeat, HEART_BEAT_PERIOD)
        }
        
        if(twin !== undefined && heartBeat.timestamp !== twin.getLastHeartBeat().timestamp){
            const timestamp = Date.now()        // get current timestamp
            console.log(twin.getID() + " is connected ! Lastseen:", timestamp - twin.getLastSeen(), "ms ago", ", LastEntry: ", timestamp - twin.getLastEntry(), "ms ago")
            twin.setLastSeen(timestamp)     // Update last seen with current timestamp
            twin.updateState(undefined, heartBeat)
            this.mongoAgent.update(twin, "Twins")

            if(timestamp - twin.getLastSeen() > timeout || twin.getDeviceState() === DeviceState.UNREACHABLE){  // If device was disconnected and is online again
                twin.setLastEntry(timestamp)    // Update last entry with current timestamp
                const agent = this.getAgent(twin) as Agent
                await agent.getProxyUrl()   // The device is connected to the broker but unreachable => proxy url has changed

                // Perform the tasks present in the task queue of the twin
                const taskManager = this.taskManagers.get(twin) as TaskManager
                const responses = await taskManager.executeTasksInWaitingQueue()
                responses.forEach(response => {
                    if(response !== undefined){
                        twin.updateState(response, undefined)
                        this.mongoAgent.update(twin, "Twins")
                    }
                });
            }
            twin.setDeviceState(DeviceState.ONLINE)  // Update State
        }
    }

    // To ensure connectivity we check after 1.5*heartBeatPeriod if we received an other heartbeat, if not
    // it means that we cannot receive heartbeat (problem on mqtt side). So we also check the proxy side to
    // be sure that the camera is offline
    public ensureDeviceConnectivity(twin:Twin, heartBeat:IHeartBeat, heartBeatPeriod:number){
        const connection = (twin:Twin, heartBeat:IHeartBeat) => {
            if(heartBeat.timestamp === twin.getLastHeartBeat().timestamp){
                twin.setDeviceState(DeviceState.UNREACHABLE)
                // console.log("Device", twin.getID(), " is offline !, Lastseen at timestamp:", twin.getLastSeen(), ", LastEntry at timestamp: ", twin.getLastEntry(), "ms ago")
                console.warn("Cannot receive heartbeat ! Check for connection with the proxy...")
                const agent = this.getAgent(twin)
                agent?.ping().then((result:Number) => {
                    if(result === 404){
                        console.warn("Cannot reach the device via proxy!\nDevice", twin.getID(), " is offline !, Lastseen at timestamp:", twin.getLastSeen(), ", LastEntry at timestamp: ", twin.getLastEntry(), "ms ago")
                    }else{
                        console.warn("Received response from proxy. Problem on MQTT side.")
                    }
                })

            }
        }

        const timeToWait = 1.5*heartBeatPeriod

        setTimeout(() => { 
            connection(twin, heartBeat)  
          }, timeToWait)
    }

    /*This function is called when the twin is modified by a user ("desired" attributes).
    It creates a task and perform it to synchronize the twin ("reported attributes").
    */
    private handleTwinModification(getTwinReference:Function, property:string, value:any){
        const twin = getTwinReference() as Twin
        const agent = this.getAgent(twin) as Agent
        const taskManager:TaskManager = this.getTaskManager(twin) as TaskManager
        const routine = RoutineFactory.generateRoutine(agent, twin, property, value)
        taskManager.registerRoutine(routine, this.handleResponse)
    }

    // Send a http request every {{ ms }} second to check connectivity with device, not use in this impl
    private async checkDeviceConnectivity(twin:Twin, ms:number){
        const agent = this.getAgent(twin)

        if(agent !== undefined){
            setInterval(async () => {
                const res = await agent.ping()     // Send "ping" request and wait for the result status code
                const timestamp = Date.now()        // get current timestamp
                if(res === 200){
                    twin.setDeviceState(DeviceState.ONLINE)  // Update State
                    console.log(twin.getID() + " is connected ! Lastseen:", timestamp - twin.getLastSeen(), "s ago", ", LastEntry: ", timestamp - twin.getLastEntry(), "s ago")
                    if(timestamp - twin.getLastSeen() > 2*ms){  // If device was disconnected and is online again
                        twin.setLastEntry(timestamp)    // Update last entry with current timestamp

                        // Perform the tasks present in the task queue of the twin
                        const taskManager = this.taskManagers.get(twin) as TaskManager
                        const responses = await taskManager.executeTasksInWaitingQueue()
                        responses.forEach(response => {
                            if(response !== undefined){
                                twin.updateState(response, undefined)
                            }
                        });

                    }
                    
                    twin.setLastSeen(timestamp)     // Update last seen with current timestamp
                    
                }else{
                    console.log(twin.getID() + " is offline ! Lastseen:", timestamp - twin.getLastSeen(), "s ago", ", LastEntry: ", timestamp - twin.getLastEntry(), "s ago")
                    twin.setDeviceState(DeviceState.UNREACHABLE)    // Update state
                }
            }, ms)
        }
    }


/*------------------ Getters & Setters ------------------------ */

    public setSubToMQTTTopic(subscribtionFunction:Function){
        this.subToMQTTTopic = subscribtionFunction
    }

    public getTwins(){
        const twins = new Array<Twin>()
        this.twins.forEach((twin:Twin, serialNumber:string) => {
            twins.push(twin)
        })
        return twins
    }

    public getAgent(deviceTwin:Twin):Agent | undefined{
        for (let [agent, twin] of this.agents) {
            if(twin === deviceTwin){
                return agent
            }
        }
        throw(Error('No registered device for that twin !'))
    }
    public getTwin(serial:string):undefined | Twin{
        return this.twins.get(serial)
    }
    public getTwinByID(ID:string):Twin | undefined{
        var twinToReturn:Twin | undefined = undefined

        this.twins.forEach((twin: Twin, serialNumber: string) => {
            if(twin.getID() === ID){
                twinToReturn = twin
            }
        });
        return twinToReturn
    }
    public setTwin(twin:Twin){
        this.twins.set(twin.getSerialNumber(), twin)
    } 
    public getTaskManager(twin:Twin){
        return this.taskManagers.get(twin)
    }
    public isDeviceAlreadyStored(newTwinId:string):boolean{
        for (const pair of this.twins) {
            if(pair[1].reported.id === newTwinId){
                return true
            }
        }
        return false
    }
}

export { Synchronizer }