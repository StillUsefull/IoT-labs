const mqtt = require('mqtt');
require('dotenv').config()

//custom
const {parse, validate, aggrigate, sleep} = require('./utils')

//schemas
const accelerometerSchema = require('./validationSchema/accelerometer.json');
const gpsSchema = require('./validationSchema/gps.json');

function getData() {
    return parse().then(data => {
        validate(data.accelerometerJson, accelerometerSchema);
        validate(data.gpsJson, gpsSchema);
        return {
            accelerometer: data.accelerometerJson,
            gps: data.gpsJson
        };
    });
}

async function connect(){
    const broker = process.env.MQTT_BROKER_HOST;
    const port = process.env.MQTT_BROKER_PORT;
    const url = `mqtt://${broker}:${port}`;
    console.log(`CONNECT TO ${url}`);
    return new Promise((resolve, reject) => {
        const client = mqtt.connect('mqtt://0.0.0.0:1883');
        client.on('connect', () => {
            console.log(`Connected to MQTT Broker (${url})!`);
            resolve(client);
        });
        client.on('error', (error) => {
            console.log(`Failed to connect ${url}, error: ${error.message}`);
            reject(error);
        });
    });
}



async function send(data, client) {
    const { accelerometer, gps } = data;
    const delay = parseInt(process.env.DELAY, 10) || 1000; 
    const topic = process.env.MQTT_TOPIC;

    for (let i = 0; i < accelerometer.length; i++) { 
        const aggregatedObject = aggrigate(accelerometer[i], gps[i]); 
        const msg = JSON.stringify(aggregatedObject);
        console.log(msg);

        await new Promise((resolve, reject) => { 
            client.publish(topic, msg, (error) => {
                if (error) {
                    console.log(`Failed to send message to topic ${topic}`);
                    reject(error); 
                } else {
                    resolve(); 
                }
            });
        });

        await sleep(delay); 
    }
}
//main
getData().then(async (data) => {
    const client = await connect(); 
    await send(data, client); 
}).catch((err) => {
    console.log(err.message);
});


