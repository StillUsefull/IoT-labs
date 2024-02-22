const Ajv = require('ajv');

exports.validate = (data, schema) => {
    const ajv = new Ajv()
    const validator = ajv.compile(schema);
    const isValid = validator(data)
    if (!isValid) {
        throw Error(`Error validating data: ${isValid}.`)
    }
}
