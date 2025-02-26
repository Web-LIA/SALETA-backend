import mongoose from "mongoose";
import '../models/Session.js';
import '../models/Config.js'
const Session = mongoose.model("sessions");
const Config = mongoose.model("config");
const configId = "67be9e30a9d5c66c3fbf7398"
export default {
    async read (req, res){
        const sessionList = await Session.find();
        return res.json(sessionList);
    },

    async create(req, res) {
        const type = req.params.type;
        const userId = req.params.userId;
        const itemId = req.params.itemId;
        if (type != "guardar" && type != "buscar") {
            return res.status(400).json({error: "tipo indevido"});
        }
        // falta verificar se o userId e itemId são corretos
        const sessionCreated = await Session.create({
            type,
            userId,
            itemId
        })
        setTimeout(async () => {
            const config = await Config.findOne({_id: configId});
            config.lastSessionId = sessionCreated._id
            config.save();
        }, 3000);
       
        return res.json(sessionCreated);
    },

    async getSessionId(req, res) {
        let lastSessionId = await ConfigController.lastSessionId();
        return res.json({id: lastSessionId});
    },

    async sendEspPhotos(req, res) {
        const photos = req.body.photos
        const sessionId = req.params.id
        if(!photos) {
            return res.status(400).json({error: "Fotos não recebidas"});
        } 
        const session = await Session.findOne({_id: sessionId});
        if (session.photos) {
            session.photos = photos;
        } 
        await session.save();
        return res.json(session);
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