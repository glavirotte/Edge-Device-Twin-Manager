import mqtt from 'mqtt'

class MQTTClient{

    private client:mqtt.MqttClient
    private address:string

    constructor(address:string){
        this.address = address
        this.client = mqtt.connect(address)
        this.client.on('message', (topic, message) => {
            console.log(message.toString())
            this.client.end()
        })
    }

    public sub(topic:string){
        this.client.subscribe(topic)
    }

}

export { MQTTClient }