const csvtojson = require('csvtojson/v2');
const Ajv = require('ajv');
exports.parse = async (csvPath) => {
    try {
        const json = await csvtojson().fromFile(csvPath);
        return json;
    } catch (error) {
        throw Error(`Error parsing CSV files: ${error.message}.`);
        
    }
}

exports.validate = (data, schema) => {
    const ajv = new Ajv()
    const validator = ajv.compile(schema);
    const isValid = validator(data)
    if (!isValid) {
        throw Error(`Error validating data: ${isValid}.`)
    }
}

exports.transform = (data) => {
    const transformed = data.map(item => ({
        empty_count: item.empty_count,
        gps: {
            longitude: item.longitude,
            latitude: item.latitude
        }
    }));
    return transformed
}

exports.aggrigate = (accelerometer, gps) => {
    return {
        accelerometer: accelerometer,
        gps: gps,
        time: new Date()
    }
}

exports.addTime = (object) => {
    return {
        ...object,
        time: new Date()
    }
}

exports.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}