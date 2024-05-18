
const dotenv=require('dotenv')
dotenv.config({path:'config.env'})

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const asyncHandler = require('express-async-handlr')
const ApiError = require('../utils/apiError');



const User = require('../models/user');
const { where } = require('sequelize');

//////////generateToken////////
function generateToken(id, email) {
  return jwt.sign(
    {
      data: {
        id,
        email,
      },
    },
    process.env.jwt_secret,
    {
      expiresIn: 3 * 24 * 60 * 60,
    }
  );
}

////////////signup/////////
exports.signup = asyncHandler(async (req, res, next) => {

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

 const  token = generateToken(user.id, user.email)

  res.status(201).json({ data: user,token }).cookie("token", token, {
    httpOnly: true,
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

});



/////login///////////////



exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Incorrect email address or password" });
    }

    const matchs = await bcrypt.compare(password, user.password);
    if (matchs)
     {
      const token = generateToken(user.id, user.email);
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({user,token,message: "Login successful" });
    } 
    
    else {
      return res
        .status(400)
        .json({ message: "Incorrect email address or password" });
    }
  } catch (err) {
    err.message = "Internal server error, failed to login.";
    next(err);
  }
};

////////////protect/////////////////
exports.protect=(req, res, next) =>{
  const token = req.headers.cookie.split('=')[1];
  
  if (!token) {
      return res.status(401).json({ message: 'Authorization header missing' });
  }

  jwt.verify(token,process.env.jwt_secret, async (err, decodedToken) => {
    
      if (err) {
          return res.status(401).json({ message: 'Invalid token' });
      }
    
      try {
          const user = await User.findByPk(decodedToken.data.id);
          
         
          if (!user) {
              return res.status(401).json({ message: 'User not found' });
          }

          req.user = user;
         
          
          next();
      } catch (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal server error' });
      }
  });
}

  ///////////////////////////authorization ////////////

  // exports.authorizedTo=(...roles)=>asyncHandler(async(req,res,next)=>{
 
  //   if (!roles.includes(req.user.dataValues.role)) {
  //      next(new ApiError('You are not authorized to access this route', 403));
  //      return
  //   }
  //  next();
  // })
  exports.authorizedTo=(role)=> {
    return (req, res, next) => {
      
        if (req.user.role !==role) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}