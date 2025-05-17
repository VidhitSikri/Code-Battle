const userModel = require('../models/user.model'); 
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');


module.exports.registerUser = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const { fullname, email, password } = req.body;
    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({firstname:fullname.firstname,lastname:fullname.lastname,email,password:hashedPassword});
    const token = user.generateAuthToken();

    res.cookie('token', token);

    return res.status(201).json({user,token}); 
    
}



module.exports.loginUser = async(req,res,next)=>{   
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const { email, password } = req.body;
    const user = await userModel.findOne({email}).select('+password');
    if(!user){
        return res.status(404).json({message: "user not found"});
    } 
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({message: "Invalid credentials"});
    }
    const token = user.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({message: "logged in successfully",user,token});
}

module.exports.getUserProfile = async(req,res,next)=>{
    res.status(200).json({ user: req.user });   
}

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) {
        return res.status(400).json({ message: "Token not found" });
    }

    res.status(200).json({ message: "Logged out successfully" });
}

module.exports.getOpponent = async (req, res, next) => {
    const { socketId } = req.params;
    const opponent = await userService.getOpponent(socketId);
    if (!opponent) {
        return res.status(404).json({ message: "Opponent not found" });
    }
    res.status(200).json({ opponent });
}