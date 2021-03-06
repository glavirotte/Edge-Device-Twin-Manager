import mqtt from 'mqtt'
import { IHeartBeat } from './interfaces/IHeartBeat'
import { Synchronizer } from './Synchronizer'

class MQTTClient{

    private client:mqtt.MqttClient      // Create a client
    private brokerUrl:string            // Url of the mqtt broker
    private synchronizer:Synchronizer   // Keep in memory the reference of the synchronizer

    constructor(synchronizer:Synchronizer, brokerUrl:string, options:mqtt.IClientOptions ){
        this.synchronizer = synchronizer
        this.brokerUrl = brokerUrl
        this.client = mqtt.connect(brokerUrl, options)

        const subscribtionFunction = this.sub.bind(this)    // function given to the synchronizer to be able to subscribe to topics
        this.synchronizer.setSubToMQTTTopic(subscribtionFunction)

        this.client.on('connect', () => {   // Start a connection with the broker
            console.log("MQTT client connected to: ", brokerUrl)
        })
        this.client.on("disconnect", () => {   // Restart a connection with the broker
            console.log("MQTT client disconnected, try to reconnect: ")
            this.client.reconnect()
        })
        this.client.on("error", (error) => {    // Handle errors
            console.log("Error: ", error)
            this.client.end()
            this.client.reconnect() // If error, try to reconnect
        })
        this.client.on('message', (topic, message) => {
            const brokerMessage:IHeartBeat = JSON.parse(message.toString())     // Parse the message as a heartbeat message
            this.synchronizer.handleMQTTBrokerMessage(topic, brokerMessage)     // Give the message to the syncrhonizer to update the twins
        })
    }

    public sub(topic:string){
        this.client.subscribe(topic)    // Topic subscription
        console.log("Subscription to new topic:", topic)
    }

}

export { MQTTClient }