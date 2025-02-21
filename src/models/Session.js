import mongoose from "mongoose";

const Session = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId
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