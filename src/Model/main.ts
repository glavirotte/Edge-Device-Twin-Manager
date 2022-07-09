/*#######################################################  
This class describes the server which provides APIs for
the React Application
#########################################################*/

import { Synchronizer } from './Synchronizer'
import { Server } from './user_interface/Server'
import {MQTTClient} from "./MQTTClient"
import { exit } from 'process'
import { MongoAgent } from './database/MongoAgent'

const tellucareMqttBroker = "wss://tellucare-mqtt-dev.tellucloud.com/mqtt"

if(process.argv.length < 4){
    console.log("> Missing arguments!\nTo run the program: npm run dev {mqttClientUsername} {mqttClientPassword}")
    exit(process.exitCode)
}
const mqttClientUsername = process.argv[2]
const mqttClientPassword = process.argv[3]

const mongoAgent = new MongoAgent("Manager", "3dGeD3v1CE7w", "Twins")

const synchronizer = new Synchronizer(mongoAgent)

const server = new Server(8000, synchronizer)

const mqttClient = new MQTTClient(synchronizer, tellucareMqttBroker, {
    port:443,
    clientId:"mqtt-explorer-33c46ed3",
    username:mqttClientUsername,
    password:mqttClientPassword
})