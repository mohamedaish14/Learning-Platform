const express=require('express');

const {
  useCourseEnrollment
    ,getAllUsers
    ,getUser
    ,updateUser
    ,deleteUser,
    changePassword,
    getUserData
}=require('../controllers/user');
const {
   
    createUserValidator,
    updateUserValidator,
    
    changeUserPasswordValidator,
  
  } = require('../utils/validators/user');
const { protect ,authorizedTo} = require('../controllers/auth');

const router=express.Router();

router.post('/'
,protect,authorizedTo('instructor')
//,createUserValidator
,useCourseEnrollment)
router.get('/',protect,authorizedTo('instructor'),getAllUsers)
router.get('/profile',protect,getUser);
//router.get('/:userId',protect,authorizedTo('instructor'),getUser);
router.put('/updateUserData',protect,updateUserValidator,updateUser);
router.put('/changeUserPassword',protect,changeUserPasswordValidator,changePassword);

router.delete('/deactiveUser',protect,deleteUser);


module.exports=router