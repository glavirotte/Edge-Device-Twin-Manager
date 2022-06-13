/*#######################################################  

This class describes the server which provides APIs for
the React Application

#########################################################*/

import { Synchronizer } from './Synchronizer'
import { Twin } from './Twin'
import { Server } from './server/Server'
import FormData from 'form-data'
import { createReadStream } from 'fs'
const cameraIP = '192.168.50.34'
const synchronizer = new Synchronizer()

const server = new Server(8000)

synchronizer.createTwin(cameraIP)
    .then((twinProxy:Twin) => {server.addTwinProxy(twinProxy)})
