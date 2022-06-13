/*#######################################################  

This class describes and give methods to communicate 
with a physical device on the local network

#########################################################*/

import  { Request } from './Request'
import  { HttpMethod } from 'urllib'
import HttpClient from 'urllib'
import { xml2json } from './Utils'
import { Application } from './Application'
import { loadJSON } from './Utils'
import { IURIs } from './interfaces/IURIs'
import { IResponse } from './interfaces/IResponse'
import util from "util"
const exec = util.promisify(require('child_process').exec);


class Agent {

    ipAddress:string
    username:string
    password:string
    URIs:IURIs

    public constructor(ipAddress:string){
        this.ipAddress = ipAddress;
        this.username = {} as string
        this.password = {} as string
        this.URIs = loadJSON('./src/Model/Data_Storage/URIs.json')
    }

/*-------------------------Device Methods-------------------------*/

    // Get json object from a Request sent to the Device
    
    async askDevice(req: Request):Promise<IResponse | undefined>{
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
        }else if(contentType.startsWith('application/json')){
            response = JSON.parse(res.data.toString())
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

    // Ping function to check connection with physical device
    // send HTTP Request to check connectivity

    public async ping(){
        const protocol = 'http'
        const DeviceIP = this.ipAddress
        const uri = this.URIs.basicdeviceinfo
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${DeviceIP}/${uri}`
        const args:Map<string, string> = new Map()
        const body = '{"apiVersion":"1.0", "method":"getSupportedVersions"}'
        const options:urllib.RequestOptions = {
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
            digestAuth: this.username+':'+this.password,
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
        const protocol = 'http'
        const DeviceIP = this.ipAddress
        const uri = this.URIs.basicdeviceinfo
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${DeviceIP}/${uri}`
        const args:Map<string, string> = new Map()
        const body = '{"apiVersion":"1.0", "method":"getAllProperties"}'
        const options:urllib.RequestOptions = {
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
            digestAuth: this.username+':'+this.password,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request)

        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

    // Request to get the list of Applications currently installed on the device

    public async listApplications():Promise<IResponse | undefined>{
        const protocol = 'https'
        const DeviceIP = this.ipAddress
        const uri = this.URIs.list
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${DeviceIP}/${uri}`
        const args:Map<string, string> = new Map()
        const options:urllib.RequestOptions = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: this.username+':'+this.password,
            timeout: 5000,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request)

        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

    // Install an application on the Device
    
    public async installApplication(arg:Application[]):Promise<IResponse | undefined>{
        const application = arg[0]
        const protocol = 'https'
        const DeviceIP = this.ipAddress
        const uri = this.URIs.upload
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${DeviceIP}/${uri}`
        const args:Map<string, string> = new Map()
        const options:urllib.RequestOptions = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: this.username+':'+this.password,
            timeout:30000,
            files: application.getLocation()
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

    public async removeApplication(arg:Application[]):Promise<IResponse | undefined>{
        const application = arg[0]
        const protocol = 'https'
        const DeviceIP = this.ipAddress
        const uri = this.URIs.control
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${DeviceIP}/${uri}`
        const args:Map<string, string> = new Map()
        args.set('package', application.getName())
        args.set('action', 'remove')
        const options:urllib.RequestOptions = {
            method: method,
            rejectUnauthorized: false,
            digestAuth: this.username+':'+this.password,
            timeout:30000,
            files: application.getLocation()
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

    public async getLightStatus():Promise<IResponse | undefined>{
        const protocol = 'http'
        const DeviceIP = this.ipAddress
        const uri = this.URIs.lightcontrol
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${DeviceIP}/${uri}`
        const args:Map<string, string> = new Map()
        const body = '{"apiVersion": "1.0","method": "getLightStatus","params": {"lightID": "led0"}}'
        const options:urllib.RequestOptions = {
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
            digestAuth: this.username+':'+this.password,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request)

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

        const protocol = 'http'
        const DeviceIP = this.ipAddress
        const uri = this.URIs.lightcontrol
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${DeviceIP}/${uri}`
        const args:Map<string, string> = new Map()
        const options:urllib.RequestOptions = {
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
            digestAuth: this.username+':'+this.password,
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
        const protocol = 'http'
        const DeviceIP = this.ipAddress
        const uri = this.URIs.firmware
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${DeviceIP}/${uri}`
        const args:Map<string, string> = new Map()
        const body = '{"apiVersion": "1.0", "method": "status"}'
        const options:urllib.RequestOptions = {
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
            digestAuth: this.username+':'+this.password,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request)
        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

    public async upgradeFirmware():Promise<IResponse | undefined>{
        const protocol = 'http'
        const DeviceIP = this.ipAddress
        const uri = this.URIs.firmware
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${DeviceIP}/${uri}`
        const location = "./resources/M1065-L_9_80_3_11.bin"
        var stdout
        const body = JSON.stringify({"apiVersion":"1.0","context":"abc","method":"upgrade"})
        try {
            var { stdout, stderr } = await exec(`curl --digest -u root:pass --location --request POST 'http://192.168.50.34/axis-cgi/firmwaremanagement.cgi' \
            --form 'json=${body}' \
            --form 'bin=@"./resources/M1065-L_9_80_3_11.bin"'`)
            const response = await this.getFirmwareStatus()
            return response
          } catch (e) {
            console.error(e); // should contain code (exit code) and signal (that caused the termination).
          }
    }

    public async rollBack():Promise<IResponse | undefined>{        
        const protocol = 'http'
        const DeviceIP = this.ipAddress
        const uri = this.URIs.firmware
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${DeviceIP}/${uri}`
        const body = '{"apiVersion": "1.0","method": "rollback"}'
        const args:Map<string, string> = new Map()
        const options:urllib.RequestOptions = {
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
            digestAuth: this.username+':'+this.password,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request)
        if(response !== undefined){
            return response
        }else{
            return undefined
        }

    }

    public async factoryDefault():Promise<IResponse | undefined>{
        const protocol = 'http'
        const DeviceIP = this.ipAddress
        const uri = this.URIs.firmware
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${DeviceIP}/${uri}`
        const args:Map<string, string> = new Map()
        const body = '{"apiVersion": "1.0","method": "factoryDefault","factoryDefaultMode": "hard"}'
        const options:urllib.RequestOptions = {
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
            digestAuth: this.username+':'+this.password,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request)

        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

    public async reboot():Promise<IResponse | undefined>{
        const protocol = 'http'
        const DeviceIP = this.ipAddress
        const uri = this.URIs.firmware
        const method: HttpMethod = 'POST'
        const url = `${protocol}://${DeviceIP}/${uri}`
        const args:Map<string, string> = new Map()
        const body = '{"apiVersion": "1.0", "method": "reboot"}'
        const options:urllib.RequestOptions = {
            method: method,
            data:JSON.parse(JSON.stringify(body)),
            rejectUnauthorized: false,
            digestAuth: this.username+':'+this.password,
        }
        const request = new Request(url, method, this.username, this.password, args, options)
        const response:IResponse | undefined = await this.askDevice(request)

        if(response !== undefined){
            return response
        }else{
            return undefined
        }
    }

/*-------------------------Getters & Setters-------------------------*/

    public getIPAddress():string{
        return this.ipAddress;
    }
    public setLoginCredentials(username:string, password:string){
        this.username = username
        this.password = password
    }

}

export { Agent }