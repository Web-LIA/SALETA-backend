import mongoose from "mongoose";
import '../models/Item.js';
const Item = mongoose.model("itens");

export default {
    async read (req, res){
        const itemList = await Item.find();
        return res.json(itemList);
    },

    async create(req, res) {
        const { title, color, size, description } = req.body;
        if (!title) {
            return res.status(400).json({error: "Necessário um título"});
        }
        const itemCreated = await Item.create({
            title,
            color,
            size,
            description
        });
        return res.json(itemCreated);
    },
}