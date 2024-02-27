const mqtt = require('mqtt');
const AgentData = require('./models/AgentData');
const { push, count, pullAllAndDelete } = require('./services/RedisStoreService');
const AgentDataService = require('./services/AgentDataService');
const client = mqtt.connect(`mqtt://${process.env.MQTT_BROKER_HOST}:${process.env.MQTT_BROKER_PORT}`);


client.on('connect', () => {
    client.subscribe(process.env.MQTT_TOPIC, (error) => {
        if (!error){
            console.log(`Sucessfully connected to MQTT`)
        }
    })
})

client.on('message', async (topic, message) => {
    try {
        new AgentData(message).validate();
        await push(message);
        const lenght = await count()
        if ( lenght >= 10){
            const records = await pullAllAndDelete()
            const agentData = new AgentDataService(records);
            agentData.aggrigateData();
            await agentData.batchData();
        }
    } catch (err){
    console.log(err)
   }
})