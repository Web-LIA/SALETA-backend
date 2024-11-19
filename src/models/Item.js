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
    // image: {
    // }
    // aprender como salvar imagem no banco de dados
});

mongoose.model("itens", Item);