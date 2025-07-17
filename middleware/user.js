const { verifyToken } = require("../services/auth");

function checkAuth(cookieName){
    return (req,res,next)=>{
        const cookieToken = req.cookies[cookieName];
        if(!cookieToken)
            return next();

        try {
            const userpayload = verifyToken(cookieToken);
            req.user = userpayload;
        } catch (error) {
            
        }
        next();
    }
}

module.exports = {
    checkAuth
}