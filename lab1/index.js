const asyncMqtt = require('async-mqtt');
require('dotenv').config()

//custom
const {parse, validate, aggrigate, sleep, transform, addTime} = require('./utils')

//schemas
const accelerometerSchema = require('./validationSchema/accelerometer.json');
const gpsSchema = require('./validationSchema/gps.json');
const parkingSchema = require('./validationSchema/parkingSchema.json');

async function getData() {
    const accelerometer = await parse('./data/accelerometer.csv');
    const gps = await parse('./data/gps.csv');
    const parking = await parse('./data/parking.csv');
    const transformedParking = transform(parking);
    validate(accelerometer, accelerometerSchema);
    validate(gps, gpsSchema);
    validate(transformedParking, parkingSchema);
    return {
        accelerometer: accelerometer,
        gps: gps,
        parking: transformedParking
    };
    
}

async function connect() {
    const broker = process.env.MQTT_BROKER_HOST || '0.0.0.0'; 
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
    const { accelerometer, gps, parking } = data;
    const delay = parseInt(process.env.DELAY) || 1000;
    const topic = process.env.MQTT_TOPIC;
    const parkingTopic = process.env.PARKING_TOPIC;
    for (let i = 0; i < accelerometer.length; i++) {

        const aggregatedObject = aggrigate(accelerometer[i], gps[i]);
        const parkingWithTime = addTime(parking[i]);

        const topicMsg = JSON.stringify(aggregatedObject);
        const parkingMsg = JSON.stringify(parkingWithTime);
        // console.log(`Message was sended: ${topicMsg}, ${parkingMsg}`);
        try {
            await client.publish(topic, topicMsg);
            await client.publish(parkingTopic, parkingMsg)
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
