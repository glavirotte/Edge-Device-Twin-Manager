import { HttpMethod } from 'urllib'
import { Camera } from "./Camera"
import { Request } from "./Request"

const protocol = 'http'
const username = 'root'
const password = 'root'
const cameraIP = '192.168.50.34'
const path = 'axis-cgi/applications/list.cgi'
const method: HttpMethod = 'POST'
const url = `${protocol}://${cameraIP}/${path}`
const args:Map<string, string> = new Map()

const options:urllib.RequestOptions = {
    method: method,
    rejectUnauthorized: false,
    // auth: "username:password" use it if you want simple auth
    digestAuth: username+':'+password,
    headers: {
    //'Content-Type': 'application/text'  use it if payload is text
    //'Content-Type': 'application/json' use it if payload is json 
    'Content-Type': 'application/xml'
    },

}

const camera = new Camera('camera1', cameraIP) // Create Camera object
const request = new Request(url, method, username, password, args, options); // Create Request
camera.getCameraData(request)  // Query to Camera