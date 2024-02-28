const mqtt = require('mqtt');
const AgentData = require('./models/AgentData');

const { push, count, pullAllAndDelete } = require('./services/RedisStoreService');
const redis = require('redis');
const AgentDataService = require('./services/AgentDataService');
require('dotenv').config();


async function main(){
        
    const client = mqtt.connect(`mqtt://${process.env.MQTT_BROKER_HOST}:${process.env.MQTT_BROKER_PORT}`);
    client.on('connect', () => {
        client.subscribe(process.env.MQTT_TOPIC, (error) => {
            if (!error){
                console.log(`Sucessfully connected to MQTT`)
            }
        })
    })
    console.log({
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_HOST
    })
    const redisClient = redis.createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    })

      try {
        await redisClient.connect();
        client.on('message', async (topic, message) => {
            try {
                //console.log(JSON.parse(message));
                new AgentData(JSON.parse(message)).validate();
                await push(redisClient, JSON.parse(message));
                const lenght = await count(redisClient)
                if ( lenght >= process.env.BATCH_SIZE){
                    const records = await pullAllAndDelete(redisClient)
                    console.log(records);
                    const agentData = new AgentDataService(records);
                    await agentData.insertData();
                }
            } catch (err){
            console.log(err)
        }
        })
      } catch (error) {
        console.error('Ошибка подключения к Redis:', error);
      }
      
   
}

main()