exports.push = async (client, record) => {
    await client.rPush(process.env.MQTT_TOPIC, JSON.stringify(record));
};

exports.count = async (client) => {
    const length = await client.lLen(process.env.MQTT_TOPIC);
    return length;
};

exports.pullAllAndDelete = async (client) => {
    const records = await client.lRange(process.env.MQTT_TOPIC, 0, -1);
    await client.del(process.env.MQTT_TOPIC);
    return records.map(record => JSON.parse(record));
};