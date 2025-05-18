const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post("/register" , [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')

], userController.registerUser);

router.post("/login",[
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
], userController.loginUser);

router.get("/profile", authMiddleware.authUser,userController.getUserProfile);
router.get("/logout", authMiddleware.authUser,userController.logoutUser);

router.get("/getOpponent/:socketId", authMiddleware.authUser,userController.getOpponent);


router.delete("/deleteAccount", authMiddleware.authUser, userController.deleteAccount);

router.put("/updateSettings", authMiddleware.authUser, [
    body('email').optional().isEmail().withMessage('Please enter a valid email'),
    body('fullname.firstname').optional().isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname').optional().isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
    body('password').optional().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
], userController.updateSettings);

module.exports = router;