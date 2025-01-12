import mongoose from "mongoose";
import '../models/User.js';

const User = mongoose.model("users");

export default {
    async read (req, res){
        const itemList = await Item.find();
        return res.json(itemList);
    },

    async create(req, res) {
        const { login,password } = req.body;
        if (!login) {
            return res.status(400).json({error: "Necessário um login"});
        }
        if (!password) {
            return res.status(400).json({error: "Necessário uma senha"});
        }
        const userCreated = await User.create({
            login,
            password
        });
        return res.json(userCreated);
    },
}