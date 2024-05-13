const User=require('../models/user');
const ApiError = require('../utils/apiError');
const asyncHandeller=require('express-async-handlr');
const nodemailer=require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth: {
      user: process.env.g_user,
      pass: process.env.g_password
    }
  });

exports.creatstudent=asyncHandeller(async(req,res,next)=>{
    const studentEmail=req.body.studentEmail;
    const isExist=await User.findOne({where:{email:studentEmail}});
    if(isExist){
        res.json({message:"this student is exist"});
        next()
    }
    const user=await User.create({
        name:'new student',
        email:studentEmail,
        password:'pass123',
        passwordConfirm:'pass123',
        role:'student'
    });
   
    var mailOptions = {
        from: "strokyApp learning platform",
        to: studentEmail,
        subject: 'storky app password',
        text:"your password is :pass123",
      };
      await transporter.sendMail(mailOptions)

      const token=jwt.sign({userId:user.id},process.env.jwt_secret,{expiresIn:process.env.expiresIn})
      res.status(201).json({data:user,message:"new student created and the password has been sent"});

    
})
   
    



exports.getAllUsers=asyncHandeller(async(req,res)=>{
 const users=await User.findAll()
    res.status(200).json({
        data:users});
})

exports.getUser=asyncHandeller(async(req,res,next)=>{
    const userId=req.params.userId;
    const user=await User.findByPk(userId)
    if(!user){
        return next(new ApiError(`No User for this id ${userId}`, 404));
    }
    res.status(200).json({data:user})
})

exports.updateUser = asyncHandeller(async (req, res,next) => {
    const { userId } = req.params;
   const name=req.body.name;
   const email=req.body.email
    const user=await User.findByPk(userId)

    if(!user){
        return next(new ApiError(`No User for this id ${userId}`, 404));
    }
    await Uesr.update({name:name,email:email},{ where: {id: userId } })
    res.status(200).json({ data: await User.findByPk(userId)});
    })

exports.changePassword=asyncHandeller(async(req,res,next)=>{
    const userId=req.params.userId;
    const password=req.body.password
    const passwordConfirm=req.body.passwordConfirm
    const user=User.findByPk(req.params.userId);
    if(!user){
        return next(new ApiError(`No User for this id ${userId}`, 404))
    }
    await User.update({password:password,passwordConfirm:passwordConfirm},{ where: {id: userId } })
    res.status(200).json({ data: await User.findByPk(userId)});
})

exports.deleteUser = asyncHandeller(async (req, res) => {
    const { userId } = req.params;
    
    const user=await Uesr.findByPk(userId)
    if(!user){
        res.status(404).json({msg: `No User for this id: ${userId}`})
    }
    await User.destroy({ where: {id: userId } })
    res.status(204).send('deleted');
    })

exports.getUserData=asyncHandeller(async(req,res,next)=>{
    req.params.userId=req.user.id;
    next();

})

// exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//       },
//       { new: true }
//     );
  
//     res.status(200).json({ data: updatedUser });
//   });

//   exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
//     // 1) Update user password based user payload (req.user._id)
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         password: await bcrypt.hash(req.body.password, 12),
//         passwordChangedAt: Date.now(),
//       },
//       {
//         new: true,
//       }
//     );
  