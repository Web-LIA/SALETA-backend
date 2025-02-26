import mongoose from "mongoose";
import '../models/Config.js';
const Config = mongoose.model("config");
const configId = "67be9e30a9d5c66c3fbf7398"
export default {
    async read (req, res){
        const itemList = await Config.find();
        return res.json(itemList);
    },

    async create(req, res) {
        const { lastSessionId,doorStatus} = req.body;
        if (!lastSessionId || !doorStatus) {
            return res.status(400).json({error: "Falta algo"});
        }
        const itemCreated = await Config.create({
            lastSessionId,
            doorStatus
        });
        return res.json(itemCreated);
    },

    async delete(req, res) {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({error: "Necessário um id"});
        }
        const itemDeleted = await Config.findOneAndDelete({_id: id});
        if (itemDeleted) {
            return res.json(itemDeleted);
        } else {
            return res.status(401).json({error: "Não foi encontrado o item para deletar"});
        }
    },
    async doorStatus(req,res){

        const item = await Config.findOne({_id: configId})
        return res.json({doorStatus:item.doorStatus});   
    },
    async lastSessionId(req , res){

        const item =  await Config.findOne({_id:configId})
        console.log(item)
        return res.json({id:item.lastSessionId});  
    },
    async openDoor(req,res){

        const item = await Config.findOne({_id:configId})
        item.doorStatus = "ON"
        await item.save();
        return res.json({doorStatus:"PORTA ABERTA"})
    },
    async closeDoor(req,res){

        const item = await Config.findOne({_id:configId})
        item.doorStatus = "OFF"
        await item.save();
        return res.json({doorStatus:"PORTA FECHADA"})
    }
       
 }