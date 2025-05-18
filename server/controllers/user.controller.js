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


module.exports.deleteAccount = async (req, res, next) => {
    const userId = req.user._id;
    const deletedUser = await userService.deleteUser(userId);
    if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
    }
    // Clear the token cookie after deleting the account
    res.clearCookie('token');
    res.status(200).json({ message: "Account deleted successfully" });
};


module.exports.updateSettings = async (req, res, next) => {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const userId = req.user._id;
        // Destructure currentPassword and newPassword from request body.
        // All other fields (like email or fullname) are kept in otherUpdates.
        const { currentPassword, newPassword, ...otherUpdates } = req.body;

        // If a new password is provided, verify that the current password exists.
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: "Current password is required to set a new password." });
            }
            // Retrieve the user including the password field.
            const user = await require('../models/user.model').findById(userId).select('+password');
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(401).json({ message: "Current password is incorrect." });
            }
            // Hash the new password and add it to the update payload.
            otherUpdates.password = await user.comparePassword 
                ? await require('../models/user.model').hashPassword(newPassword) 
                : newPassword;
        }

        // Optionally update the email or fullname if provided.
        if (req.body.email) {
            otherUpdates.email = req.body.email;
        }
        if (req.body.fullname) {
            otherUpdates.fullname = req.body.fullname;
        }

        const updatedUser = await require('../services/user.service').updateUserSettings(userId, otherUpdates);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Settings updated successfully", user: updatedUser });
    } catch (error) {
        next(error);
    }
};