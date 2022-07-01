/*#######################################################  
This class describes the server which provides APIs for
the React Application
#########################################################*/

import { Synchronizer } from './Synchronizer'
import { Twin } from './twin/Twin'
import { Server } from './user_interface/Server'
import {MQTTClient} from "./MQTTClient"
import { exit } from 'process'

const tellucareMqttBroker = "wss://tellucare-mqtt-dev.tellucloud.com/mqtt"
const cameraID = '8992'


const synchronizer = new Synchronizer()
if(process.argv.length < 4){
    console.log("> Missing arguments!\nTo run the program: npm run dev {mqttClientUsername} {mqttClientPassword}")
    exit(process.exitCode)
}
const mqttClientUsername = process.argv[2]
const mqttClientPassword = process.argv[3]


const server = new Server(8000)

const mqttClient = new MQTTClient(synchronizer, tellucareMqttBroker, {
    port:443,
    clientId:"mqtt-explorer-33c46ed3",
    username:mqttClientUsername,
    password:mqttClientPassword
})

synchronizer.createTwin(cameraID)
    .then((twin:Twin) => {server.addTwin(twin)})


