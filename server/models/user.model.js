const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "Firstname must be at least 3 characters long"],
            maxlength: [50, "Firstname must be at most 50 characters long"]
        },
        lastname: {
            type: String,
            minlength: [3, "lastname must be at least 3 characters long"],
            maxlength: [50, "lastname must be at most 50 characters long"],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, "Email must be at least 5 characters long"],
        maxlength: [50, "Email must be at most 50 characters long"],
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socketId: {
        type: String,
    },
});


userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY);
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;