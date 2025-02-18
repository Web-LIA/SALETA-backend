import mongoose from "mongoose";
import '../models/Item.js';
const Item = mongoose.model("itens");

export default {
    async read (req, res){
        const itemList = await Item.find();
        return res.json(itemList);
    },

    async create(req, res) {
        const { title, color, size, description, photo } = req.body;
        if (!title) {
            return res.status(400).json({error: "Necessário um título"});
        }
        const itemCreated = await Item.create({
            title,
            color,
            size,
            description,
            photo
        });
        return res.json(itemCreated);
    },

    async delete(req, res) {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({error: "Necessário um id"});
        }
        const itemDeleted = await Note.findOneAndDelete({_id: id});
        if (itemDeleted) {
            return res.json(itemDeleted);
        } else {
            return res.status(401).json({error: "Não foi encontrado o item para deletar"});
        }
    }
}