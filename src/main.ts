import { HttpMethod } from 'urllib'
import { Camera } from "./Camera"
import { Request } from "./Request"

const protocol = 'https'
const username = 'root'
const password = 'root'
const cameraIP = '192.168.50.34'
const path = 'axis-cgi/applications/list.cgi'
const method: HttpMethod = 'GET'
const url = `${protocol}://${cameraIP}/${path}`
const args:Map<string, string> = new Map()

const camera = new Camera('camera1', cameraIP) // Create Camera object
const request = new Request(url, method, username, password, args); // Create Request

camera.getCameraData(request)  // Query to Camera
