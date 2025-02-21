import mongoose from "mongoose";

const Session = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    userId: {
        // type: mongoose.Schema.Types.ObjectId:
        type: String
    },
    itemId: {
        // type: mongoose.Schema.Types.ObjectId
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    photos: {
        type: [String],
        default: []
    }
});

mongoose.model("sessions", Session);