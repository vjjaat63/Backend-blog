const { verifyToken } = require("../services/auth");
const redisClient = require("../config/redis");

function checkAuth(cookieName) {
    return async (req, res, next) => {
        try {
            const token = req.cookies[cookieName];

            if (!token) {
                return next();
            }

            const userpayload = verifyToken(token);

            const isBlocked = await redisClient.exists(`token:${token}`);
            if (isBlocked) {
                return res.clearCookie('Token').redirect("/");
                // return res.status(401).json({ message: "Invalid Token" });
            }

            req.user = userpayload;
            next();

        } catch (error) {
            next(error);
        }
    }
}

module.exports = {
    checkAuth
}