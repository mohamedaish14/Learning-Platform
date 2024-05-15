const express=require('express');

const {
    creatSession
    ,getAllSessions
    ,getSession
    ,updateSession
    ,deleteSession
}=require('../controllers/session');
const { protect,authorizedTo } = require('../controllers/auth');

const router=express.Router();

router.post('/:courseId/sessions',protect, authorizedTo('instructor'),creatSession)
router.get('/:courseId/sessions',protect,getAllSessions)
router.get('/courseId/sessions/:sessionId',protect,getSession);
router.put('/:courseId/sessions/:sessionId',protect , authorizedTo('instructor'),updateSession);
router.delete('/:courseId/sessions/:sessionId', protect, authorizedTo('instructor'),deleteSession);


module.exports=router