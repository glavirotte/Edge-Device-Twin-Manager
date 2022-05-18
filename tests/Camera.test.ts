import { Request } from '../src/Request'
import { HttpMethod } from 'urllib'
import { Camera } from "../src/Camera"

const protocol = 'https'
const username = 'root'
const password = 'root'
const cameraIP = '192.168.50.34'
const path = 'axis-cgi/applications/list.cgi'
const method: HttpMethod = 'GET'
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

describe('Testing if camera is reachable and can send data', () => {
    let data:JSON;

    describe('Get application list from camera', () => {
        beforeEach(async () => {
            data = await camera.getCameraData(request);
        })
    })

    it('Compare with the exepected output', () => {
        expect(data).toEqual({
            "reply": {
              "$": {
                "result": "ok"
              },
              "application": [
                {
                  "$": {
                    "Name": "vmd",
                    "NiceName": "AXIS Video Motion Detection",
                    "Vendor": "Axis Communications",
                    "Version": "4.4-5",
                    "ApplicationID": "143440",
                    "License": "None",
                    "Status": "Stopped",
                    "ConfigurationPage": "local/vmd/config.html",
                    "VendorHomePage": "http://www.axis.com",
                    "LicenseName": "Proprietary"
                  }
                }
              ]
            }
          }
          )
    })
  });