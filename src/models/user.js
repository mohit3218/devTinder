const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique:true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    age:{
        type: Number,
        min:18
    },
    gender:{
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    about:{
        type: String,
        default:"This is a default value of the user!"
    },
    skills:{
        type:[String]
    },
    photoUrl:{
        type: String,
        default:"https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
    }
}, {timestamps: true})

const User = mongoose.model("User" , userSchema);
module.exports = User;