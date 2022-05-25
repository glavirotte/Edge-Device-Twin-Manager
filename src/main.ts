import { DeviceManager } from './DeviceManager'

const cameraIP = '192.168.50.34'
const deviceManager = new DeviceManager()

deviceManager.createTwin(cameraIP).then((twin)=>{
        console.log(twin)
})
