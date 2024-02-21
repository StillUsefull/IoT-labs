const asyncMqtt = require('async-mqtt');
//require('dotenv').config()

//custom
const {parse, validate, aggrigate, sleep} = require('./utils')

//schemas
const accelerometerSchema = require('./validationSchema/accelerometer.json');
const gpsSchema = require('./validationSchema/gps.json');

async function getData() {
    const data = await parse('./data/accelerometer.csv', './data/gps.csv')
    validate(data.accelerometerJson, accelerometerSchema);
    validate(data.gpsJson, gpsSchema);
    return {
        accelerometer: data.accelerometerJson,
        gps: data.gpsJson
    };
    
}

async function connect() {
    const broker = process.env.MQTT_BROKER_HOST || 'localhost'; 
    const port = process.env.MQTT_BROKER_PORT || '1883';
    const url = `mqtt://${broker}:${port}`;
    console.log(`CONNECT TO ${url}`);
    try {
        const client = await asyncMqtt.connectAsync(url);
        console.log(`Connected to MQTT Broker (${url})!, ${client}`);
        return client;
    } catch (error) {
        console.log(`Failed to connect ${url}, error: ${error.message}`);
        throw error; 
    }
}



async function send(data, client) {
    const { accelerometer, gps } = data;
    console.log(gps)
    const delay = parseInt(process.env.DELAY, 10) || 1000;
    const topic = process.env.MQTT_TOPIC || 'test/topic'; // Добавьте значения по умолчанию для примера
    for (let i = 0; i < accelerometer.length; i++) {
        const aggregatedObject = aggrigate(accelerometer[i], gps[i]);
        const msg = JSON.stringify(aggregatedObject);
        console.log(`Message was sended: ${msg}`);
        try {
            await client.publish(topic, msg);
        } catch (error) {
            console.log(`Failed to send message to topic ${topic}`, error);
            break
        }
        await sleep(delay);
    }
}
//main
async function main() {
    try {
        const data = await getData();
        const client = await connect();
        while (true) {
            await send(data, client);
        }
    } catch (error) {
        console.error('Error in main function:', error.message);
        throw error
    }
}

main();
