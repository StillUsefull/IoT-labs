const Ajv = require('ajv');

class AgentData {
    constructor(dataObject){
        this.data = dataObject;
        this.validator = new Ajv().compile(require('./schemas/AgentData.json'))
    };

    validate(){
        const isValid = this.validator(this.data)
        if (!isValid) {
            throw Error(`Error validating data: ${isValid}.`)
        }
    }

    processData(){
        if (this.data.accelerometer.y < 42){
            this.data.road_state = 'pit';
        } 
        else if (this.data.accelerometer.y > 100){
            this.data.road_state = 'mound';
        } else {
            this.data.road_state = 'normal'
        }
    }

}

module.exports = AgentData;