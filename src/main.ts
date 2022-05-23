import { Device } from './Device'
import { DeviceManager } from './DeviceManager'

const cameraIP = '192.168.50.34'
const deviceManager = new DeviceManager()
deviceManager.registerDevice(new Device(cameraIP))   // instanciate Device object