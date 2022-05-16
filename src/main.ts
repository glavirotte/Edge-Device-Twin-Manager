import { HttpMethod } from 'urllib'
import {Request, getCameraData} from './Request'
const protocol = 'https'
const username = 'root'
const password = 'root'
const cameraIP = '192.168.50.34'
const path = 'axis-cgi/applications/list.cgi'
const method: HttpMethod = 'GET'
const url = `${protocol}://${cameraIP}/${path}`
const args:string[] = []

Request req = new Request(url, method, username, password, args);
getCameraData(req);
