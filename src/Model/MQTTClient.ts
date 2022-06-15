import mqtt from 'mqtt'
import { IBrokerMessage } from './interfaces/IBrokerMessage'
import { Synchronizer } from './Synchronizer'

class MQTTClient{

    private client:mqtt.MqttClient
    private address:string
    private synchronizer:Synchronizer

    constructor(synchronizer:Synchronizer, brokerUrl:string, options:mqtt.IClientOptions ){
        this.synchronizer = synchronizer
        this.address = brokerUrl
        this.client = mqtt.connect(brokerUrl, options)

        this.client.on('connect', () => {
            console.log("MQTT client successfully connect to: ", brokerUrl)
        })
        this.client.on("error", (error) => {
            console.log("Error: ", error)
        })
        this.client.on('message', (topic, message) => {
            const brokerMessage:IBrokerMessage = JSON.parse(message.toString()) 
            this.synchronizer.handleMQTTBrokerMessage(topic, brokerMessage)
        })
    }

    public sub(topic:string){
        this.client.subscribe(topic)
    }

}

export { MQTTClient }