const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const authmiddleware = async (req,res,next)=>{
    const token = req.headers.authorization.split(' ')[1];
    // console.log(token);
    if(!token) return res.status(401).json("token not present");
    const decode = jwt.verify(token,JWT_SECRET);

    req.userId = decode.id;

    next();

}
module.exports = authmiddleware;