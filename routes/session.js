const express=require('express');

const {
    creatSession
    ,getAllSessions
    ,getSession
    ,updateSession
    ,deleteSession
}=require('../controllers/session');

const router=express.Router();

router.post('/:courseId/sessions',creatSession)
router.get('/:courseId/sessions',getAllSessions)
router.get('/courseId/sessions/:sessionId',getSession);
router.put('/:courseId/sessions/:sessionId', updateSession);
router.patch('/:courseId/sessions/:sessionId', updateSession);
router.delete('/courseId/sessions/:sessionId', deleteSession);


module.exports=router