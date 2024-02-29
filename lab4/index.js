const mqtt = require('mqtt');
const AgentData = require('./models/AgentData');
require('dotenv').config();


const MQTT_BROKER_HOST = process.env.MQTT_BROKER_HOST || '0.0.0.0';
const MQTT_BROKER_PORT = process.env.MQTT_BROKER_PORT || '1883'
const mqttUrl = `mqtt://${MQTT_BROKER_HOST}:${MQTT_BROKER_PORT}`
const hubTopic = process.env.HUB_MQTT_TOPIC;

function main(){
    const client = mqtt.connect(mqttUrl);
    client.on('connect', () => {
        client.subscribe(process.env.MQTT_TOPIC, (error) => {
            if (!error){
                console.log(`Sucessfully connected to MQTT`)
            }
        })
    });

    client.on('message', (topic, message) => {
        try {
            const obj = JSON.parse(message);
            const agentData = new AgentData(obj);
           // console.log(agentData.data)
            agentData.validate();
            agentData.processData();
            client.publish(hubTopic, JSON.stringify(agentData.data));
        } catch (e) {
            console.log(e.message);
        }
    })
}

main();