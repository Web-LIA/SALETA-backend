import mongoose from "mongoose";
import '../models/Session.js';
const Session = mongoose.model("sessions");

export default {
    async read (req, res){
        const sessionList = await Session.find();
        return res.json(sessionList);
    },

    async create(req, res) {
        const { type, userId, itemId } = req.params;
        if (type !== "guardar" || type !== "buscar") {
            return res.status(400).json({error: "tipo indevido"});
        }
        // falta verificar se o userId e itemId são corretos
        const sessionCreated = await Session.create({
            type,
            userId,
            itemId
        });
        return res.json(sessionCreated);
    },

    async delete(req, res) {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({error: "Necessário um id"});
        }
        const sessionDeleted = await Session.findOneAndDelete({_id: id});
        if (sessionDeleted) {
            return res.json(sessionDeleted);
        } else {
            return res.status(401).json({error: "Não foi encontrado uma sessão para deletar"});
        }
    }
}