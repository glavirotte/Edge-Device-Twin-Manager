import { Agent } from "../Agent";
import { ApplicationTwin } from "../application/ApplicationTwin";
import { Firmware } from "../Firmware";import { Twin } from "../twin/Twin";
import { Routine } from "./Routine";
import { Task } from "./Task";

// const properties = Object.getOwnPropertyNames(Object.getPrototypeOf(agent))

class RoutineFactory {
    
    //Create a routine to perform, from a change in twin properties

    static generateRoutine(agent:Agent, twin:Twin, modifiedTwinProperty:string, newValue:any):Routine{  
        // console.log("Modification of property", modifiedTwinProperty, "on twin:", twin.getID())

        var routine:Routine = new Routine("")
        switch (modifiedTwinProperty) {
            case 'lightStatus':
                if(twin.reported.lightStatus !== newValue){
                    const task = this.switchLight(agent, "")
                    routine.addTask(task)
                    console.log(routine)
                }
                break;

            case 'applications':
                routine = RoutineFactory.manageApps(agent, twin, newValue as (ApplicationTwin)[], routine)
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
                console.log('new App:', modifiedApp)
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

    static getLightStatus (agent:Agent, date:string){return new Task(agent, agent.getLightStatus, new Array(), date)}

    static listApplications (agent:Agent, date:string){return new Task(agent, agent.listApplications, new Array(), date)}

    static installApplication (agent:Agent, app:ApplicationTwin, date:string){return new Task(agent, agent.installApplication, [app], date)}

    static controlApplication (agent:Agent, app:ApplicationTwin, action:string, date:string){return new Task(agent, agent.controlApplication, [app, action], date)}

    static getFirmwareStatus(agent:Agent, date:string){return new Task(agent, agent.getFirmwareStatus, [], date)}

    static reboot(agent:Agent, date:string){return new Task(agent, agent.reboot, [], date)}

    static upgradeFirmware(agent:Agent, date:string){return new Task(agent, agent.upgradeFirmware, [new Firmware("M1065-L_9_80_3_11", "/home/alphagone/Documents/Polytech/2021-2022/Stage/AXIS_Camera/App_dev/M1065-L_9_80_3_11.bin")], date)}

    static factoryDefault(agent:Agent, date:string){return new Task(agent, agent.factoryDefault, [], date)}

    static rollBack(agent:Agent, date:string){return new Task(agent, agent.rollBack, [], date)}

    static getMqttStatus(agent:Agent, date:string){return new Task(agent, agent.getMqttClientStatus, new Array(), date)}

    static configureMqttClient(agent:Agent, twin:Twin, date:string){return new Task(agent, agent.configureMqttClient, [twin.getSerialNumber(), "", ""], date)}

    static configureMqttEvent(agent:Agent, twin:Twin, date:string){return new Task(agent, agent.configureMqttEvent, [twin.getSerialNumber(), [{"topicFilter": "Monitoring/HeartBeat","qos": 1,"retain": "all"}]], date)}
    
    static getMqttEventConfiguration(agent:Agent, date:string){return new Task(agent, agent.getMqttEventConfiguration, [], date)}

    static switchLight(agent:Agent, date:string){return new Task(agent, agent.switchLight, [], date)}

}
export { RoutineFactory }
