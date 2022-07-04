/*#######################################################  
This class describes and give methods to communicate 
with a physical device on the local network
#########################################################*/

import  { Request } from './Request'
import  { HttpMethod } from 'urllib'
import HttpClient from 'urllib'
import { xml2json } from './Utils'
import { ApplicationTwin } from './application/ApplicationTwin'
import { loadJSON } from './Utils'
import { IURIs } from './interfaces/IURIs'
import { IResponse } from './interfaces/IResponse'
import util from "util"
import { FirmwareTwin } from './firmware/FirmwareTwin'
import { IAgent } from './interfaces/IAgent'
const exec = util.promisify(require('child_process').exec);


class Agent implements IAgent{

    cameraID:string
    proxyUrl:string
    username:string
    password:string
    URIs:IURIs

    public constructor(cameraID:string){
        this.cameraID = cameraID;
        this.username = {} as string
        this.password = {} as string
        this.URIs = loadJSON('./src/Model/Data_Storage/URIs.json')
        this.proxyUrl = ""
    }

/*-------------------------Device Methods-------------------------*/

    // Get json object from a Request sent to the Device
    
    private async askDevice(req: Request):Promise<IResponse | string |undefined>{
        try {
        // Send request to the Device
        const res = await HttpClient.request(req.getURL(), req.getOptions())
        const contentType = res.headers['content-type'] as string
        var response:IResponse = {} as IResponse
        if(contentType === 'text/xml'){
            var data = {} as any;
            data = await xml2json(res.data)  // Parse xml to json
            response=  JSON.parse(JSON.stringify(data))

        }else if(contentType === 'text/plain'){
            if(res.status != 200){
                throw new Error('Error with request ! Status code: '+res.status.toString()+" data: "+res.data.toString())
            }
            console.log("Status code: ", res.status.toString())
            console.log("Data: ", res.data.toString())
            return res.data.toString()
        }else if(contentType.startsWith('application/json')){
            response = JSON.parse(res.data.toString())
        }else{
            // For debuging
            // console.log(res.status)
            // console.log(res.headers)
            // console.log(res.data.toString())
        }

        return response

        } catch (error) {
            if (error instanceof Error) {
                console.log('In askDevice -> error message: ', error.message);
            } else {
                console.log('unexpected error: ', error);
            }
            return undefined
        }
    }

    // Function to get the proxy url to be able to interract with the physical device

    public async getProxyUrl():Promise<boolean | undefined>{
        try {
            var { stdout, stderr } = await exec(`bash ./secret/morphean-test.sh ${this.cameraID}`)
            this.proxyUrl = stdout
            console.log("Proxy url request !", this.proxyUrl)
            return true
        } catch (error) {
            console.log(error, "Morphean server unreachable, cannot get proxy url !")
            return undefined
        }
    }

    // Ping function to check connection with physical device
    // send HTTP Request to check connectivity

    public async ping(){
        const uri = this.URIs.axis.ping
        const method: HttpMethod = 'GET'
        const url = `${this.proxyUrl}${uri}`
        const args:Map<string, string> = new Map()
        args.set("ip", "127.0.0.1")
        const options:urllib.RequestOptions = {
            method: method,
            rejectUnauthorized: false,
            timeout:1000,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        var status = 404
        try {
            const response = await HttpClient.request(request.getURL(), request.getOptions())
            status = response.status
        } catch (error) {
            // console.log(error)
        }finally{
            return status
        }
    }

    public async getDeviceInfo():Promise<IResponse | undefined>{
        const uri = this.URIs.axis.basicdeviceinfo
        const method: HttpMethod = 'POST'
        const url = `${this.proxyUrl}${uri}`
        const args:Map<string, string> = new Map()
        const body = '{"apiVersion":"1.0", "method":"getAllProperties"}'
        const options:urllib.RequestOptions = {
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
        
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request) as (IResponse | undefined)

        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

    // Request to get the list of Applications currently installed on the device

    public async listApplications():Promise<IResponse | undefined>{
        const uri = this.URIs.axis.list
        const method: HttpMethod = 'POST'
        const url = `${this.proxyUrl}${uri}`
        const args:Map<string, string> = new Map()
        const options:urllib.RequestOptions = {
            method: method,
            rejectUnauthorized: false,
            timeout: 5000,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request) as (IResponse | undefined)

        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

    // Install an application on the Device
    
    public async installApplication(arg:ApplicationTwin[]):Promise<IResponse | undefined>{
        const application = arg[0]
        console.log("Request to install app:", application.getName())
        
        const uri = this.URIs.axis.upload
        const method: HttpMethod = 'POST'
        const url = `${this.proxyUrl}${uri}`
        const args:Map<string, string> = new Map()
        const options:urllib.RequestOptions = {
            method: method,
            rejectUnauthorized: false,
            timeout:30000,
            files: await application.getFile()
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        await this.askDevice(request)

        const response:IResponse | undefined = await this.listApplications()
        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

    // Remove an application from the Device


    public async controlApplication(arg:(ApplicationTwin | string)[]):Promise<IResponse | undefined>{
        
        const application = arg[0] as ApplicationTwin
        const action = arg[1] as string

        console.log("Request to", action, "app:", application.getName())

        const uri = this.URIs.axis.control
        const method: HttpMethod = 'POST'
        const url = `${this.proxyUrl}${uri}`
        const args:Map<string, string> = new Map()
        args.set('package', application.getName())
        args.set('action', action)
        const options:urllib.RequestOptions = {
            method: method,
            rejectUnauthorized: false,
            timeout:30000,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const result:string = await this.askDevice(request) as string

        const response:IResponse | undefined = await this.listApplications()
        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

    public async getLightStatus():Promise<IResponse | undefined>{
        const uri = this.URIs.axis.lightcontrol
        const method: HttpMethod = 'POST'
        const url = `${this.proxyUrl}${uri}`
        const args:Map<string, string> = new Map()
        const body = '{"apiVersion": "1.0","method": "getLightStatus","params": {"lightID": "led0"}}'
        const options:urllib.RequestOptions = {
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request) as (IResponse | undefined)

        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

    async switchLight():Promise<IResponse | undefined>{
        var response = await this.getLightStatus()
        var lightStatus
        var body

        if(response !== undefined){
            lightStatus = response.data?.status
        }else{
            return undefined
        }

        if(lightStatus === true){
            body = '{"apiVersion": "1.0","method": "deactivateLight","params": {"lightID": "led0"}}'
        }else if(lightStatus === false){
            body = '{"apiVersion": "1.0","method": "activateLight","params": {"lightID": "led0"}}'
        }else{
            return undefined
        }

        const uri = this.URIs.axis.lightcontrol
        const method: HttpMethod = 'POST'
        const url = `${this.proxyUrl}${uri}`
        const args:Map<string, string> = new Map()
        const options:urllib.RequestOptions = {
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        await this.askDevice(request)
        response = await this.getLightStatus()
        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

    public async getFirmwareStatus():Promise<IResponse | undefined>{
        const uri = this.URIs.axis.firmware
        const method: HttpMethod = 'POST'
        const url = `${this.proxyUrl}${uri}`
        const args:Map<string, string> = new Map()
        const body = '{"apiVersion": "1.0", "method": "status"}'
        const options:urllib.RequestOptions = {
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request) as (IResponse | undefined)
        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

    public async upgradeFirmware(arg:FirmwareTwin[]):Promise<IResponse | undefined>{
        const firmware = arg[0]
        console.log("Request to update firmware to version:", firmware.reported.fileName)

        const uri = this.URIs.axis.firmware
        const method: HttpMethod = "POST"
        const url = this.proxyUrl.slice(0, -1).concat("/"+uri)
        const location = firmware.getFile()
        var stdout
        const body = JSON.stringify({"apiVersion":"1.0","context":"abc","method":"upgrade"})
        try {
            var { stdout, stderr } = await exec(`curl --location --request ${method} '${url}' \
            --form 'json=${body}' \
            --form 'bin=@${location}'`)
            console.log("stdout", stdout)
            const response = JSON.parse(stdout) as IResponse | undefined
            if(response !== undefined){
                return response
            }else{
                return undefined
            }
          } catch (e) {
            console.error(e); // should contain code (exit code) and signal (that caused the termination).
          }
        return undefined
    }

    public async rollBack():Promise<IResponse | undefined>{        

        const uri = this.URIs.axis.firmware
        const method: HttpMethod = 'POST'
        const url = `${this.proxyUrl}${uri}`
        const body = '{"apiVersion": "1.0","method": "rollback"}'
        const args:Map<string, string> = new Map()
        const options:urllib.RequestOptions = {
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request) as (IResponse | undefined)
        if(response !== undefined){
            return response
        }else{
            return undefined
        }

    }

    public async factoryDefault():Promise<IResponse | undefined>{
        const uri = this.URIs.axis.firmware
        const method: HttpMethod = 'POST'
        const url = `${this.proxyUrl}${uri}`
        const args:Map<string, string> = new Map()
        const body = '{"apiVersion": "1.0","method": "factoryDefault","factoryDefaultMode": "hard"}'
        const options:urllib.RequestOptions = {
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request) as (IResponse | undefined)
        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

    public async reboot():Promise<IResponse | undefined>{
        const uri = this.URIs.axis.firmware
        const method: HttpMethod = 'POST'
        const url = `${this.proxyUrl}${uri}`
        const args:Map<string, string> = new Map()
        const body = '{"apiVersion": "1.0", "method": "reboot"}'
        const options:urllib.RequestOptions = {
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request) as (IResponse | undefined)

        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

    public async getMqttClientStatus():Promise<IResponse | undefined>{
        const uri = this.URIs.axis.mqtt.client
        const method: HttpMethod = 'POST'
        const url = `${this.proxyUrl}${uri}`
        const args:Map<string, string> = new Map()
        const body = '{"apiVersion": "1.0","context": "some context","method": "getClientStatus"}'
        const options:urllib.RequestOptions = {
            headers:{
                "content-type": "application/json"
            },
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request) as (IResponse | undefined)
        if(response !== undefined){
            return response
        }else{
            return undefined
        }

    }

    public async activateMqttClient():Promise<IResponse | undefined>{
        const uri = this.URIs.axis.mqtt.client
        const method: HttpMethod = 'POST'
        const url = `${this.proxyUrl}${uri}`
        const args:Map<string, string> = new Map()
        const body = '{"apiVersion": "1.0","context": "some context","method": "activateClient","params": {}}'
        const options:urllib.RequestOptions = {
            headers:{
                "content-type": "application/json"
            },
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        await this.askDevice(request)

        const response:IResponse | undefined = await this.getMqttClientStatus()
        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

    public async deactivateMqttClient():Promise<IResponse | undefined>{
        const uri = this.URIs.axis.mqtt.client
        const method: HttpMethod = 'POST'
        const url = `${this.proxyUrl}${uri}`
        const args:Map<string, string> = new Map()
        const body = '{"apiVersion": "1.0","context": "some context","method": "deactivateClient","params": {}}'
        const options:urllib.RequestOptions = {
            headers:{
                "content-type": "application/json"
            },
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        await this.askDevice(request)

        const response:IResponse | undefined = await this.getMqttClientStatus()
        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

    public async configureMqttClient(arg:string[]):Promise<IResponse | undefined>{
        const deviceSerial = arg[0]
        const mqttUsername = arg[1]
        const mqttPassword = arg[2]

        const uri = this.URIs.axis.mqtt.client
        const method: HttpMethod = 'POST'
        const url = `${this.proxyUrl}${uri}`
        const args:Map<string, string> = new Map()
        const body = {
            "apiVersion": "1.0",
            "method": "configureClient",
            "params": {
              "server": {
                "protocol": "wss",
                "host": "tellucare-mqtt-dev.tellucloud.com",
                "port": 443,
                "basepath": "/mqtt"
              },
              "username": mqttUsername,
              "password": mqttPassword,
              "clientId": "fleet",
              "keepAliveInterval": 20,
              "connectTimeout": 30,
              "cleanSession": true,
              "autoReconnect": true,
              "lastWillTestament": {
                "useDefault": false,
                "topic": "AXIS/"+deviceSerial+"/ConnectionStatus",
                "message": "Connection Lost",
                "retain": true,
                "qos": 1
              },
              "connectMessage": {
                "useDefault": false,
                "topic": "AXIS/"+deviceSerial+"/ConnectionStatus",
                "message": "Connected",
                "retain": true,
                "qos": 1
              },
              "disconnectMessage": {
                "useDefault": false,
                "topic": "AXIS/"+deviceSerial+"/ConnectionStatus",
                "message": "Disconnected",
                "retain": true,
                "qos": 1
              },
              "ssl": {
                "validateServerCert": true
              }
            }
          }  
        const options:urllib.RequestOptions = {
            headers:{
                "content-type": "application/json"
            },
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        await this.askDevice(request)

        const response:IResponse | undefined = await this.getMqttClientStatus()
        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

    public async getMqttEventConfiguration():Promise<IResponse | undefined>{

        const uri = this.URIs.axis.mqtt.event
        const method: HttpMethod = 'POST'
        const url = `${this.proxyUrl}${uri}`
        const args:Map<string, string> = new Map()
        const body = {
            apiVersion: '1.0',
            method: 'getEventPublicationConfig',
          };
        const options:urllib.RequestOptions = {
            headers:{
                "content-type": "application/json"
            },
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request) as (IResponse | undefined)

        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }
    
    public async configureMqttEvent(arg:(string | Object[])[]):Promise<IResponse | undefined>{
        const deviceSerial = arg[0]
        const eventFilterList = arg[1]

        const uri = this.URIs.axis.mqtt.event
        const method: HttpMethod = 'POST'
        const url = `${this.proxyUrl}${uri}`
        const args:Map<string, string> = new Map()
        const body = {
            apiVersion: '1.0',
            method: 'configureEventPublication',
            params: {
              topicPrefix: 'custom',
              customTopicPrefix: `AXIS/${deviceSerial}`,
              appendEventTopic: true,
              includeTopicNamespaces: false,
              includeSerialNumberInPayload: true,
              eventFilterList:eventFilterList,
            },
          };
        const options:urllib.RequestOptions = {
            headers:{
                "content-type": "application/json"
            },
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        await this.askDevice(request)

        const response:IResponse | undefined = await this.getMqttEventConfiguration()
        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }
    

/*-------------------------Getters & Setters-------------------------*/

    public getCameraID():string{
        return this.cameraID;
    }
    public setLoginCredentials(username:string, password:string){
        this.username = username
        this.password = password
    }

}

export { Agent }