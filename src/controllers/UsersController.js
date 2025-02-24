import mongoose from "mongoose";
import '../models/User.js';

const User = mongoose.model("users");

export default {
    async read (req, res){
        const UserList = await User.find();
        return res.json(UserList);
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

    async id(req,res){
        const UserList = await User.find();
        
        
        const users = [];

        UserList.forEach((usuario) =>{
            users.push({user:usuario.login ,_id:usuario._id});
        })
        
        return res.json(users);
    },

    async search(req,res){
        const {login,password} = req.body
        const user = await User.find({login:login});
        console.log(user)
        console.log("login " + login  + " senha:" + password)
        if(!user){
            return res.json({error: "Usuário não existe"});
        }
        if(user[0].password != password){
            return res.json({error: "Senha incorreta"});
        }
        return res.json(user);
        
    }
}