const Course = require("../models/course");
const User = require("../models/user");
const user_course=require("../models/user_course")
const ApiError = require("../utils/apiError");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handlr");
const { where } = require("sequelize");

exports.creatCourse = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const token = req.headers.authorization.split(" ")[1];

  let cId;
  jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
    cId = decodedToken.data.id;
  });

  const course = await Course.create({
    name: name,
    description: description,
    instructorId: cId,
  });
  res.status(201).json({ data: course });
});

exports.getAllCourses = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let Id;
  jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
    Id = decodedToken.data.id;
  });
  const user = await User.findByPk(Id);
  if (user.dataValues.role == "instructor") {
    const courses = await Course.findAll({ where: { instructorId: Id } });

    res.status(200).json({ data: courses });
  } else {
    const userWithCourses = await User.findOne({
        where: { id: Id},
        include: [{
            model: Course,
            attributes: ['id','name','description', 'createdAt', 'updatedAt'],
            through: { attributes: [] } 
        }]
    });

    if (!userWithCourses) {
        res.status(404).json({message:"no courses for this user"}) }

        const courses = userWithCourses.courses.map(course => ({
            id: course.id,
            description: course.description,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt
        }));
        res.status(200).json({ data: courses })

    }
    
  
});

exports.getCourse = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  let cId;
  jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
    cId = decodedToken.data.id;
  });
  const user = await User.findByPk(cId);
  const courseId = req.params.courseId;
  if (user.dataValues.role == "instructor") {
    const course = await Course.findOne({ where: { id:courseId,instructorId: cId } });

    res.status(200).json({ data: course });
  } else {
    const userWithCourses = await User.findOne({
        where: { id: cId},
        include: [{
            model: Course,
            where: { id: courseId },
            attributes: ['id', 'name','description', 'createdAt', 'updatedAt'],
            through: { attributes: [] } 
        }]
    });
    
    if (!userWithCourses) {
        res.status(404).json({message:"incorrect course id"}) }

    
         res.status(200).json({ data:userWithCourses.courses[0]. dataValues})

    }
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  let cId;
  jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
    cId = decodedToken.data.id;
  });
  const courseId = req.params.courseId;
  const course = await Course.findOne({
    where: { id: courseId, instructorId: cId },
  });

  if (!course) {
    return next(new ApiError(`No course for this id ${courseId}`, 404));
  }
  const { name, description } = req.body;
  await Course.update({ name, description }, { where: { id: courseId } });
  const new_u = await Course.findByPk(courseId);
  res.status(200).json({ data: new_u });
});

exports.deleteCourse = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let cId;
  jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
    cId = decodedToken.data.id;
  });
  const courseId = req.params.courseId;
  const course = await Course.findOne({
    where: { id: courseId, instructorId: cId },
  });
  if (!course) {
    res.status(404).json({ msg: `No course for this id: ${courseId}` });
  }
  await Course.destroy({ where: { id: courseId } });
  res.status(204).send("deleted");
});
