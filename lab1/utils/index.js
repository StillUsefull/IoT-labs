const csvtojson = require('csvtojson/v2');
const Ajv = require('ajv');
exports.parse = async (accelerometerPath = './data/accelerometer.csv', gpsPath = './data/gps.csv') => {
    try {
        const accelerometerJson = await csvtojson().fromFile(accelerometerPath);
        const gpsJson = await csvtojson().fromFile(gpsPath);
        return {
            accelerometerJson,
            gpsJson
        };
    } catch (error) {
        throw Error(`Error parsing CSV files: ${error.message}.`);
        
    }
}

exports.validate = (data, schema) => {
    const ajv = new Ajv()
    const validator = ajv.compile(schema);
    const isValid = validator(data)
    if (!isValid) {
        throw Error(`Error validating data: ${isValid.errors}.`)
    }
}

exports.aggrigate = (accelerometer, gps) => {
    console.log({
        accelerometer: accelerometer,
        gps: gps,
        time: new Date()
    })
    return {
        accelerometer: accelerometer,
        gps: gps,
        time: new Date()
    }
}

exports.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}