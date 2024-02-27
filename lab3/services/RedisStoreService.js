const client = require('./redis');

exports.push = async (record) => {
    await client.rPush(process.env.MQTT_TOPIC, JSON.stringify(record));
};

exports.count = async () => {
    const length = await client.lLen(process.env.MQTT_TOPIC);
    return length;
};

exports.pullAllAndDelete = async () => {
    const records = await client.lRange(process.env.MQTT_TOPIC, 0, -1);
    await client.del(process.env.MQTT_TOPIC);
    return records.map(record => JSON.parse(record));
};