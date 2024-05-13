
const dotenv=require('dotenv')
dotenv.config({path:'config.env'})

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const asyncHandler = require('express-async-handlr')
const ApiError = require('../utils/apiError');



const User = require('../models/user');
const { where } = require('sequelize');


exports.signup = asyncHandler(async (req, res, next) => {
  
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

 const token=jwt.sign({userId:user.id},process.env.jwt_secret,{expiresIn:process.env.expiresIn})

  res.status(201).json({ data: user, token });
});



/////login///////////////

exports.login=asyncHandler(async(req,res,next)=>{

    const user=await User.findOne({where:{email:req.body.email}})
    
    const isCorrectPassword=await bcrypt.compare(req.body.password,user.password);
   

    if(!user||!isCorrectPassword){
        return next(new ApiError('incorrect email or password'))
    
    }
    const token=jwt.sign({userId:user.id,role:user},process.env.jwt_secret,{expiresIn:process.env.expiresIn});
    res.status(201).json({ data: user, token });
})

////////////////protect//////////////////
exports.protect = asyncHandler(async (req, res, next) => {
    //  Check if token exist, if exist get
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(
        new ApiError(
          'You are not login, Please login to get access this route',
          401
        )
      );
    }

  
    //  Verify token (no change happens, expired token)
    const decoded = jwt.verify(token, process.env.jwt_secret);
  
    //  Check if user exists
    const currentUser = await User.findByPk(decoded.userId);
    if (!currentUser) {
      return next(
        new ApiError(
          'The user that belong to this token does no longer exist',
          401
        )
      );
     
    }
    req.user = currentUser;
    next();
  });
  

  ///////////////////////////authorization ////////////

  exports.authorizedTo=(...roles)=>asyncHandler(async(req,res,next)=>{
 
    if (!roles.includes(req.user.dataValues.role)) {
      return next(new ApiError('You are not authorized to access this route', 403));
    }
    
   next();
  })