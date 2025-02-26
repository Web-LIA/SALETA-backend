
import mongoose from "mongoose";

const Config = new mongoose.Schema({
    lastSessionId : {
        type:String,
        required:true
    },
    doorStatus: {
        type:String,
        required:true
    }



})

mongoose.model("config", Config);