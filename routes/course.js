const express=require('express');

const {
    creatCourse
    ,getAllCourses
    ,getCourse
    ,updateCourse
    ,deleteCourse
}=require('../controllers/course');

const router=express.Router();

router.post('/',creatCourse)
.get('/',getAllCourses).get('/:courseId',getCourse);
router.put('/:courseId', updateCourse);
router.patch('/:courseId', updateCourse);
router.delete('/:courseId', deleteCourse);


module.exports=router