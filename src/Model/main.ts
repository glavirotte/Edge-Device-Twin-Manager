/*#######################################################  
This class describes the server which provides APIs for
the React Application
#########################################################*/

import { Synchronizer } from './Synchronizer'
import { Twin } from './Twin'
import { Server } from './server/Server'
import {MQTTClient} from "./MQTTClient"

const cameraID = '8992'

const server = new Server(8000)
const synchronizer = new Synchronizer()
const mqttClient = new MQTTClient(synchronizer, "wss://tellucare-mqtt-dev.tellucloud.com/mqtt", {
    port:443,
    clientId:"mqtt-explorer-33c46ed3",
    username:"",
    password:""
})

synchronizer.createTwin(cameraID)
    .then((twinProxy:Twin) => {server.addTwinProxy(twinProxy)})

