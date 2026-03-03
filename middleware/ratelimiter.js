const redisClient = require("../config/redis");

const ratelimiter = async (req, res, next) => {

    try {
        const ip = req.ip;
        console.log(ip);
        const no_of_requests = await redisClient.incr(ip);
        if (no_of_requests > 100) {
            throw new Error("Rate Limit Exceeded");
        }
        else if (no_of_requests == 1) {
            await redisClient.expire(3600);
        }
        // console.log(ip, no_of_requests)
        next();
    } catch (error) {
        console.log("Error : " + error);
    }

}

module.exports = ratelimiter;