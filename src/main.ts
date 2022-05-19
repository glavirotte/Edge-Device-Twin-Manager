import { Application } from './Application'
import { Device } from './Device'
import { DeviceManager } from './DeviceManager'
import { loadJSON } from './Utils'

const cameraIP = '192.168.50.34'
const appLocation = '../App_dev/Loitering_Guard/AXIS_Loitering_Guard_2_3_2.eap'
const app = new Application('loiteringguard', appLocation)

const camera = new Device('camera1', cameraIP) // instanciate Device object
const deviceManager = new DeviceManager()
deviceManager.registerDevice(camera)
const cam = deviceManager.getDevice('camera1')

if(cam != undefined ){
    cam.listApplications()
    // cam.installApplication(app);
    // cam.removeApplication(app);
}