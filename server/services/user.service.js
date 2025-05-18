const userModel = require('../models/user.model');


module.exports.createUser = async({firstname,lastname,email,password})=>{
    if(!firstname || !email || !password){
        throw new Error("Please enter all the required fields");
    }
    const user = userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    })

    return user;
}


module.exports.getOpponent = async (socketId) => {
    const user = await userModel.find({ socketId });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}

module.exports.deleteUser = async (userId) => {
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
        throw new Error("User not found");
    }
    return deletedUser;
}


module.exports.updateUserSettings = async (userId, updateData) => {
    const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
    );
    if (!updatedUser) {
        throw new Error("User not found");
    }
    return updatedUser;
};