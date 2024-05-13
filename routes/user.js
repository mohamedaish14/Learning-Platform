const express=require('express');

const {
  creatstudent
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
    updateLoggedUserValidator,
  } = require('../utils/validators/user');
const { protect ,authorizedTo} = require('../controllers/auth');

const router=express.Router();

router.post('/',createUserValidator,authorizedTo('instructor'),creatstudent)
router.get('/',protect,getAllUsers)
router.get('/profile',protect,getUserData,getUser);
// router.get('/:userId',protect,getUser);
router.put('/:userId',protect,updateUserValidator,updateUser);
router.put('/:userId/changepassword',protect,changeUserPasswordValidator,changePassword);

router.delete('/:userId',protect,deleteUser);


module.exports=router