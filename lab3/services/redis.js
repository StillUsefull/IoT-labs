const redis = require('redis');

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

const client = redis.createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    password: REDIS_PASSWORD
});


client.connect()
  .then(() => console.log('Connected to Redis successfully!'))
  .catch((err) => console.error('Failed to connect to Redis:', err));

module.exports = client;