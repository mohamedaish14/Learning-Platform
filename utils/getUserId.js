const dotenv=require('dotenv')
dotenv.config({path:'config.env'})

const jwt = require('jsonwebtoken');


function getUserId(headers){
    const token = headers.cookie.split('=')[1];
    jwt.verify(token,process.env.jwt_secret, async (err, decodedToken) => {
    return   decodedToken.data.id;
    
 })}

module.exports=getUserId;