import mongoose from "mongoose";
import '../models/Item.js';
const Item = mongoose.model("itens");

export default {
    async read (req, res){
        const itemList = await Item.find();
        return res.json(itemList);
    },

    async create(req, res) {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({error: "Necessário um name"});
        }
        const itemCreated = await Item.create({
            name
        });
        return res.json(itemCreated);
    },
}