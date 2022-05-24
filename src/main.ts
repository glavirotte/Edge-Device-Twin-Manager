import { Application } from './Application'
import { Device } from './Device'
import { DeviceManager } from './DeviceManager'
import { Twin } from './Twin'

const cameraIP = '192.168.50.34'
const deviceManager = new DeviceManager()

deviceManager.createTwin(cameraIP)

// function foo(){
//     console.log("timer")
// }

// setInterval(foo,1000);


