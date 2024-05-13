const Course=require('../models/course');
const ApiError = require('../utils/apiError');
const asyncHandeller=require('express-async-handlr');


exports.creatCourse=asyncHandeller(async(req,res,next)=>{
   
    const name=req.body.name;
    const description=req.body.description;
  const course= await Course.create({name:name,description:description})
    res.status(201).json({data:course});})

exports.getAllCourses=asyncHandeller(async(req,res)=>{
 const courses=await Course.findAll()
    
    res.status(200).json({
       
        data:courses});
})

exports.getCourse=asyncHandeller(async(req,res,next)=>{
    const courseId=req.params.courseId;
    const course=await Course.findByPk(courseId)
    if(!course){
        return next(new ApiError(`No course for this id ${courseId}`, 404));
    }
    res.status(200).json({data:course})
})

exports.updateCourse = asyncHandeller(async (req, res,next) => {
   console.log( 'Reached controller function')
    const { courseId } = req.params;
    const  {name,description} = req.body;
   
    const course=await Course.findByPk(courseId)
    if(!course){
        return next(new ApiError(`No course for this id ${courseId}`, 404));
    }
    await Course.update({name,description},{ where: {id: courseId } })
    const new_u=await Course.findByPk(courseId);
    res.status(200).json({ data: new_u});
    })

exports.deleteCourse = asyncHandeller(async (req, res) => {
    const { courseId } = req.params;
    
    const course=await Course.findByPk(courseId)
    if(!course){
        res.status(404).json({msg: `No course for this id: ${courseId}`})
    }
    await Course.destroy({ where: {id: courseId } })
    res.status(204).send('deleted');
    })

