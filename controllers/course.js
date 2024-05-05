const Course=require('../models/course');
const slugify=require('slugify');
const asyncHandeller=require('express-async-handlr');


exports.creatCourse=asyncHandeller(async(req,res,next)=>{
   
    const name=req.body.name;
    const description=req.body.description;
  const course= await Course.create({name:name,description:description})
    res.status(201).json({data:course});})

exports.getAllCourses=asyncHandeller(async(req,res)=>{
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 5;
    // const skip = (page - 1) * limit;

    const courses=await Course.findAll()
    
    res.status(200).json({
       
        data:courses});
})

exports.getCourse=asyncHandeller(async(req,res)=>{
    const courseId=req.params.courseId;
    const course=await Course.findByPk(courseId)
    if(!course){
        res.status(404).json({msg: `No course for this id: ${courseId}`})
    }
    res.status(200).json({data:course})
})

exports.updateCourse = asyncHandeller(async (req, res) => {
    const { courseId } = req.params;
    const  {name,description} = req.body;
   
    const course=await Course.findByPk(courseId)
    if(!course){
        res.status(404).json({msg: `No course for this id: ${courseId}`})
    }
    await Course.update({name,description},{ where: {id: courseId } })
    res.status(200).json({ data: await Course.findByPk(courseId)});
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

