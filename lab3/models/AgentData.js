const Ajv = require('ajv');

class AgentData {
    constructor(obj){
        this.obj = obj;
        this.validator = new Ajv().compile(require('./schemas/AgentData.json'))
    }

    validate(){
        const isValid = this.validator(this.obj)
        if (!isValid) {
            throw Error(`Error validating data: ${isValid}.`)
        }
    }
}

module.exports = AgentData;