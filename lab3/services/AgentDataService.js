const db = require('./db')

class AgentDataService {
    constructor(batchData){
        this.batchData = batchData;
    }


    aggrigateData(){
        this.aggrigatedData = this.batchData.map((record) => {
            try {
                const accelerometer = record.accelerometer;
                const gps = record.gps;
                const time = record.time;
                const road_state = record.road_state
                return {...accelerometer, ...gps, road_state: road_state, timestamp: time};
            } catch (e){
                console.log(e.message)
            }
        });
        
    }

    async insertData() {
        this.aggrigateData();
        console.log(this.aggrigatedData) 
        try {
            await db.tx(async t => {
                const queries = this.aggrigatedData.map(record => {
                    return t.none(
                        'INSERT INTO processed_agent_data(x, y, z, latitude, longitude, timestamp, road_state) VALUES(${x}, ${y}, ${z}, ${latitude}, ${longitude}, ${timestamp}, ${road_state})',   
                        record
                    );
                });
                await t.batch(queries);
            });
            console.log("All data has been inserted successfully.");
        } catch (e) {
            console.error("Error inserting data:", e.message);
        }
    }
}
module.exports = AgentDataService;