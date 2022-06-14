/*#######################################################  
This class describes the server which provides APIs for
the React Application
#########################################################*/

import { Synchronizer } from './Synchronizer'
import { Twin } from './Twin'
import { Server } from './server/Server'
const cameraID = '8992'
const synchronizer = new Synchronizer()

const server = new Server(8000)

synchronizer.createTwin(cameraID)
    .then((twinProxy:Twin) => {server.addTwinProxy(twinProxy)})