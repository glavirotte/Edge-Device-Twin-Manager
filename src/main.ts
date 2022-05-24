import { Application } from './Application'
import { Device } from './Device'
import { DeviceManager } from './DeviceManager'

const cameraIP = '192.168.50.34'
const deviceManager = new DeviceManager()
const camera = new Device(cameraIP)
const app:Application = new Application("loiteringguard", "../App_dev/Loitering_Guard/AXIS_Loitering_Guard_2_3_2.eap")

deviceManager.registerDevice(camera)   // instanciate Device object
    // .then(() => {deviceManager.getDevice(camera.getID())?.removeApplication(app)
    //     .then(response => {if(response !== undefined) {deviceManager.updateDeviceTwin(camera, response)}})})
    
    // .then(() => {deviceManager.getDevice(camera.getID())?.installApplication(app)
    //     .then(response => {if(response !== undefined) {deviceManager.updateDeviceTwin(camera, response)}})})
