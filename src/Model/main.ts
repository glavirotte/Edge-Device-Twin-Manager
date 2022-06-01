/*#######################################################  

This class describes the server which provides APIs for
the React Application

#########################################################*/

import { DeviceManager } from './DeviceManager'
import { Twin } from './Twin'
import { Server } from './server/Server'
const cameraIP = '192.168.50.34'
const deviceManager = new DeviceManager()

const server = new Server(8000)

deviceManager.createTwin(cameraIP)
    .then((twinProxy:Twin) => {server.addTwinProxy(twinProxy)})