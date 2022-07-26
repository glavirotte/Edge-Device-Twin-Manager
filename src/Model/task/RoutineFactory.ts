import { Agent } from "../Agent";
import { ApplicationTwin } from "../application/ApplicationTwin";
import { FirmwareTwin } from "../firmware/FirmwareTwin";
import { FirmwareTwinProperties } from "../firmware/FirmwareTwinProperties";
import { IMQTTClientStatus } from "../interfaces/IMQTTClientStatus";
import { Twin } from "../twin/Twin";
import { Routine } from "./Routine";
import { Task } from "./Task";

// const properties = Object.getOwnPropertyNames(Object.getPrototypeOf(agent))

class RoutineFactory {
    
    //Create a routine to perform, from a change in twin properties

    static generateRoutine(agent:Agent, twin:Twin, modifiedTwinProperty:string, newValue:any):Routine{  
        // console.log("Modification of property", modifiedTwinProperty, "on twin:", twin.getID())

        var routine:Routine = new Routine(twin.desired.effectivityDate)
        switch (modifiedTwinProperty) {
            case 'lightStatus':
                if(twin.reported.lightStatus !== newValue){
                    const task = this.switchLight(agent, "")
                    routine.addTask(task)
                }
                break;

            case 'applications':
                routine = RoutineFactory.manageApps(agent, twin, newValue as (ApplicationTwin)[], routine)
                break;

            case 'firmware':
                routine = RoutineFactory.manageFirware(agent, twin, newValue as FirmwareTwin, routine)
                break;
            
            case 'mqttClientStatus':
                routine = RoutineFactory.manageMQTTClientStatus(agent, twin, newValue as IMQTTClientStatus, routine)
                break;
            
            case 'mqttEventConfig':
                break;

            default:
                break;
        }
        return routine
    }

    static manageApps(agent:Agent, twin:Twin, modifiedApplications:(ApplicationTwin)[], routine:Routine):Routine{   // Not tested

        for (const modifiedApp of modifiedApplications){
            if(twin.contains(modifiedApp)){
                const registeredApp = twin.getAppTwin(modifiedApp.reported.Name) as ApplicationTwin
                const desiredStatus = modifiedApp.desired.Status
                const effectiveStatus = registeredApp.reported.Status

                let action = ""

                if( desiredStatus !== effectiveStatus ){
                    if(desiredStatus === "Running"){
                        action = "start"
                    }else if(desiredStatus === "Stopped"){
                        action = "stop"
                    }
                    if(action !== ""){
                        routine.addTask(this.controlApplication(agent, registeredApp, action, ""))
                    }else{
                        throw new Error("Incorrect Status was entered ! " + desiredStatus)
                    }
                }
            }else{
                routine.addTask(this.installApplication(agent, new ApplicationTwin(modifiedApp.desired), ""))
            }
        }

        // Check if some apps have been removed
        if(twin.reported.applications !== null){
            for(const storedApp of twin.reported.applications){
                let hastoBeRemoved:boolean = true
                for(const modifiedApp of modifiedApplications){
                    if(modifiedApp.desired.Name === storedApp.reported.Name){
                        hastoBeRemoved = false
                    }
                }
                if(hastoBeRemoved){
                    routine.addTask(this.controlApplication(agent, storedApp, "remove", ""))
                }
            }
        }
        return routine
    }

    static manageFirware(agent:Agent, twin:Twin, modifiedFirmware:FirmwareTwin, routine:Routine):Routine{
        if(twin.reported.firmware.reported.activeFirmwareVersion !== modifiedFirmware.desired.activeFirmwareVersion){
            const task = this.upgradeFirmware(agent, modifiedFirmware.desired, "")
            routine.addTask(task)
        }
        return routine
    }

    static manageMQTTClientStatus(agent:Agent, twin:Twin, modifiedMQTTClientStatus:IMQTTClientStatus, routine:Routine):Routine{
        if(JSON.stringify(twin.reported.mqttClientStatus) !== JSON.stringify(modifiedMQTTClientStatus)){
            if(modifiedMQTTClientStatus.config.password.includes("*****")){
                throw new Error("You need to enter the mqtt client password to update mqtt config or status!")
            }
            if(twin.reported.mqttClientStatus.status.state !== modifiedMQTTClientStatus.status.state && modifiedMQTTClientStatus.status.state === "active"){
                routine.addTask(this.activateMqttClient(agent, ""))
            }else if(twin.reported.mqttClientStatus.status.state !== modifiedMQTTClientStatus.status.state && modifiedMQTTClientStatus.status.state === "inactive"){
                routine.addTask(this.deactivateMqttClient(agent, ""))
            }
            const task = this.configureMqttClient(agent, twin, modifiedMQTTClientStatus, "")
            routine.addTask(task)
        }
        return routine
    }

    static getLightStatus (agent:Agent, date:string){return new Task(agent, agent.getLightStatus, new Array(), date)}

    static listApplications (agent:Agent, date:string){return new Task(agent, agent.listApplications, new Array(), date)}

    static installApplication (agent:Agent, app:ApplicationTwin, date:string){return new Task(agent, agent.installApplication, [app], date)}

    static controlApplication (agent:Agent, app:ApplicationTwin, action:string, date:string){return new Task(agent, agent.controlApplication, [app, action], date)}

    static getFirmwareStatus(agent:Agent, date:string){return new Task(agent, agent.getFirmwareStatus, [], date)}

    static reboot(agent:Agent, date:string){return new Task(agent, agent.reboot, [], date)}
    
    static upgradeFirmware(agent:Agent, firmwareTwinProperties:FirmwareTwinProperties,date:string){return new Task(agent, agent.upgradeFirmware, [new FirmwareTwin(firmwareTwinProperties)], date)}
    
    static factoryDefault(agent:Agent, date:string){return new Task(agent, agent.factoryDefault, [], date)}

    static rollBack(agent:Agent, date:string){return new Task(agent, agent.rollBack, [], date)}

    static getMqttStatus(agent:Agent, date:string){return new Task(agent, agent.getMqttClientStatus, new Array(), date)}

    static configureMqttClient(agent:Agent, twin:Twin, mqttClientStatus:IMQTTClientStatus, date:string){return new Task(agent, agent.configureMqttClient, [twin.getSerialNumber(), mqttClientStatus], date)}

    static configureMqttEvent(agent:Agent, twin:Twin, date:string){return new Task(agent, agent.configureMqttEvent, [twin.getSerialNumber(), [{"topicFilter": "Monitoring/HeartBeat","qos": 1,"retain": "all"}]], date)}
    
    static getMqttEventConfiguration(agent:Agent, date:string){return new Task(agent, agent.getMqttEventConfiguration, [], date)}

    static switchLight(agent:Agent, date:string){return new Task(agent, agent.switchLight, [], date)}

    static activateMqttClient(agent:Agent, date:string){return new Task(agent, agent.activateMqttClient, [], date)}

    static deactivateMqttClient(agent:Agent, date:string){return new Task(agent, agent.deactivateMqttClient, [], date)}
}

export { RoutineFactory }
