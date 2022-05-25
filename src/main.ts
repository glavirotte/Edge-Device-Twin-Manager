import { Application } from './Application'
import { DeviceManager } from './DeviceManager'
const cameraIP = '192.168.50.34'
const deviceManager = new DeviceManager()

deviceManager.createTwin(cameraIP).then((twin)=>{
        console.log(twin)
})

// const app = new Application("lol", "test")

// const watchedObject = onChange(app, () =>{console.log("changed !")})