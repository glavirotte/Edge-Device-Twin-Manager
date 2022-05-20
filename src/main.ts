import { Application } from './Application'
import { Device } from './Device'
import { DeviceManager } from './DeviceManager'

const cameraIP = '192.168.50.34'
const appLocation = '../App_dev/Loitering_Guard/AXIS_Loitering_Guard_2_3_2.eap'
const app = new Application('loiteringguard', appLocation)

const deviceManager = new DeviceManager()
const camera = new Device(cameraIP) // instanciate Device object
deviceManager.registerDevice(camera)