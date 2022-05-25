
import { DeviceManager } from './DeviceManager'
import { Twin } from './Twin'
const cameraIP = '192.168.50.34'
const deviceManager = new DeviceManager()

deviceManager.createTwin(cameraIP).then((twinProxy:Twin) => {
    twinProxy.setLightStatus(false)
})
