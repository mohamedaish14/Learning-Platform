const Course=require('../models/course');
const Session=require('../models/session');
const ApiError=require('../utils/apiError')
const asyncHandeller=require('express-async-handlr');


exports.creatSession=asyncHandeller(async(req,res,next)=>{
   
    const name=req.body.name;
    const description=req.body.description;
    const duration=req.body.duration;
    const {courseId}=req.params;
  const course=await Course.findByPk(courseId)
  if(!course){
    return next(new ApiError(`No course for this id ${courseId}`, 404));
}
  const session= await Session.create({
    name:name
    ,description:description,
    duration:duration,
    courseId:courseId})

    res.status(201).json({data:session});})

exports.getAllSessions=asyncHandeller(async(req,res,next)=>{
 
    const {courseId}=req.params
    const course=await Course.findByPk(courseId)
  if(!course){
    return next(new ApiError(`No course for this id ${courseId}`, 404));
}
    const sessions=await Session.findAll({where:{courseId:courseId}})
    if(!sessions){
        return next(new ApiError(`No session for this id ${courseId}`, 404));
      }
    res.status(200).json({
       
        data:sessions});
})

exports.getSession=asyncHandeller(async(req,res,next)=>{
    const courseId=req.params.courseId;
    const sessionId=req.params.sessionId
    const course=await Course.findByPk(courseId)
    if(!course){
        return next(new ApiError(`No course for this id ${courseId}`, 404));
    }
    const session=await Session.findByPk(sessionId)
    if(!session){
        return next(new ApiError(`No session for this id ${sessionId}`, 404));
    }
    res.status(200).json({data:session})
})

exports.updateSession = asyncHandeller(async (req, res,next) => {
    const { courseId,sessionId } = req.params;
    const  {name,description,deuration} = req.body;
   
    const course=await Course.findByPk(courseId)
    if(!course){
        return next(new ApiError(`No course for this id ${courseId}`, 404));
    }
    const session=await Session.findByPk(sessionId)
    if(!session){
        return next(new ApiError(`No session for this id ${sessionId}`, 404));
    }
    await Session.update({name,description,deuration},{ where: {id: sessionId } })
    res.status(200).json({ data: await Course.findByPk(courseId)});
    })

exports.deleteSession= asyncHandeller(async (req, res,next) => {
    const { courseId,sessionId } = req.params;
    
    const course=await Course.findByPk(courseId)
    if(!course){
        return next(new ApiError(`No course for this id ${courseId}`, 404));
    }
    const session=await Session.findByPk(sessionId)
    if(!session){
        return next(new ApiError(`No session for this id ${sessionId}`, 404));
    }
    await Session.destroy({ where: {id: sessionId } })
    res.status(204).json({mss:'deleted'});
    })