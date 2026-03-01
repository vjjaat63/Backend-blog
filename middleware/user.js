const { verifyToken } = require("../services/auth");
const  redisClient = require("../config/redis");

function checkAuth(cookieName){
    return async (req,res,next)=>{
        try{

            const token = req.cookies[cookieName];
            if(!token)
                return next();
            
            
            const userpayload = verifyToken(token);
            req.user = userpayload;
            const isBlocked = await redisClient.exists(`token:${token}`);
            if(isBlocked){
                throw new error("Invalid Token");
            }
            next();
        }
        catch (error) {  
            console.log("error : ",error);
        }

    }
}

module.exports = {
    checkAuth
}