/*#######################################################  

This class describes the server which provides APIs for
the React Application

#########################################################*/

import { Synchronizer } from './DeviceManager'
import { Twin } from './Twin'
import { Server } from './server/Server'
const cameraIP = '192.168.50.34'
const synchronizer = new Synchronizer()

const server = new Server(8000)

synchronizer.createTwin(cameraIP)
    .then((twinProxy:Twin) => {server.addTwinProxy(twinProxy)})