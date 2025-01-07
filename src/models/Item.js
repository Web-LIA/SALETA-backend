import mongoose from "mongoose";

const Item = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    color: {
        type: String
    },
    size: {
        type: String
    },
    description: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now()
    },
    found: {
        type: Boolean,
        default: false
    },
    photo: {
        type: String,
        default: ""
    }
});

mongoose.model("itens", Item);