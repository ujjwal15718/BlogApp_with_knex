const jwt=require("jsonwebtoken")
exports.verifyToken=(req,res,next)=>{
    if(req.headers.cookie){
        const cookie = req.headers.cookie
        const token = cookie.split("=")[1]
        const userId = jwt.verify(token, 'ujjwal')
        req.id = userId.id
        next()
    }else{
        res.send("cookie has expired")
    }

}