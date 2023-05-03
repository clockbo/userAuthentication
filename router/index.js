const express=require('express');
const passport=require('passport');
const router=express.Router();
const homecontrooler=require('../controller/home_controller');
router.get('/',homecontrooler.home);
router.get('/profile',passport.checkAuthenticated,homecontrooler.profile);
router.post('/create',homecontrooler.create);
router.post('/create-session',passport.authenticate('local',{failureRedirect:'back'}),
homecontrooler.create_session)
router.get('/signout',homecontrooler.destrodesession);
router.get('/forget',homecontrooler.forgetpassword);
router.post('/forget',homecontrooler.passwordverified);
router.get('/forget-password',homecontrooler.forgetpasswordloaded);
router.post('/forget-password',homecontrooler.resetpassword);
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/'}), homecontrooler.create_session);
module.exports=router;