const { createClient } = require('redis');

// Check if Redis environment variables are set
if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
    console.error("ERROR: REDIS_HOST and REDIS_PORT environment variables must be set");
    process.exit(1);
}

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

module.exports = redisClient;
