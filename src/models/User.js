import mongoose from "mongoose";

const  User = new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    }
});

mongoose.model("users", User);