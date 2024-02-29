const Ajv = require('ajv');

class AgentData {
    constructor(accelerometer, gps, time){
        this.accelerometer = accelerometer;
        this.gps = gps;
        this.time = time;
        this.validator = new Ajv().compile(require('./schemas/AgentData.json'))
    };

    validate(){
        const isValid = this.validator(this.obj)
        if (!isValid) {
            throw Error(`Error validating data: ${isValid}.`)
        }
    }

    processData(){
        if (this.accelerometer.y < 42){
            this.road_state = 'pit';
        } 
        else if (this.accelerometer.y > 100){
            this.road_state = 'mound';
        } else {
            this.road_state = 'normal'
        }
    }

}

module.exports = AgentData;