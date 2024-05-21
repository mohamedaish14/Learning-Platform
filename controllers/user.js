const User = require("../models/user");
const Course = require("../models/course");
const user_course = require("../models/user_course");

const ApiError = require("../utils/apiError");
const asyncHandeller = require("express-async-handlr");

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.g_user,
    pass: process.env.g_password,
  },
});

exports.useCourseEnrollment = asyncHandeller(async (req, res, next) => {
  const addedCourseId = req.body.addedCourseId;
  const studentEmail = req.body.studentEmail;

  const student = await User.findOne({where:{email:studentEmail}});

  let text;
  if (!student) {
    await User.create({
      name: "new stundent",
      email: studentEmail,
      password: "StundentPass123#",
      role: "student",
    });
    text = `welcome in our platform,you are invited to new course https://learning-platform-9wrh.onrender.com/courses/${addedCourseId},your password is:StundentPass123# `;
  } else {
    text=`you are invited to new course,go check it:https://learning-platform-9wrh.onrender.com/courses/${addedCourseId}`;
  }

  var mailOptions = {
    from: "strokyApp learning platform",
    to: studentEmail,
    subject: `storky app enrollment`,
    text: text,
  };

  //send email
  await transporter.sendMail(mailOptions);

  //find the student
  const addedStudent = await User.findOne({where: {email: studentEmail}});

  //add course id to the user_course table
  await user_course.create({
    courseId: addedCourseId,
    userId: addedStudent.dataValues.id,
  });

  res.status(201).json({ message: "the student  has been invited" });
});

exports.getAllUsers = asyncHandeller(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let instructorId;
  jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
    instructorId = decodedToken.data.id;
  });
  
  const users = await User.findAll({
    include: [{
      model: Course,
      where: { instructorId },
      attributes: [], 
      through: { attributes: [] } 
    }]
  });
  // const users = await User.findAll();
   res.status(200).json({
   data: users,
   results:users.length
  });

});

exports.getUser = asyncHandeller(async (req, res, next) => {
  let cId;
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
    cId = decodedToken.data.id;
  });
  const user = await User.findByPk(cId);
  if (!user) {
    return next(new ApiError(`invalid token try to log in again`, 404));
  }
  res.status(200).json({ data: user });
});

exports.updateUser = asyncHandeller(async (req, res, next) => {
    let cId;
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
      cId = decodedToken.data.id;
    });

    const user = await User.findByPk(cId);
    if (!user) {
      return next(new ApiError(`invalid token try to log in again`, 404));
  }
  await User.update({ name: req.body.name, email: req.body.email }, { where: { id: cId } });
  res.status(200).json({ data: await User.findByPk(cId),message:'updated' });
});

exports.changePassword = asyncHandeller(async (req, res, next) => {
    let cId;
    const token = req.headers.token.split(" ")[1];
    jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
      cId = decodedToken.data.id;
    });

    const user = await User.findByPk(cId);
    if (!user) {
      return next(new ApiError(`invalid token try to log in again`, 404));
    }
 

  user.password = req.body.password;
  await user.save();
  res.status(200).json({ data: user,message:'password updated ' });
});

exports.deleteUser = asyncHandeller(async (req, res) => {
    let cId;
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
      cId = decodedToken.data.id;
    });

    const user = await User.findByPk(cId);
    if (!user) {
      return next(new ApiError(`invalid token try to log in again`, 404))};

  await User.destroy({ where: { id: cId } });
  res.status(204).send("deleted");
});



