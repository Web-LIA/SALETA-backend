import mongoose from "mongoose";
import '../models/User.js';
import { RolesEnum } from "../enums/RolesEnum.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { user } from "firebase-functions/v1/auth";

const User = mongoose.model("users");

export default {
    async read (req, res){
        const UserList = await User.find();
        return res.json(UserList);
    },

    async create(req, res) {
        let { login,password, role } = req.body;
        if (!login) {
            return res.status(400).json({error: "Necessário um login"});
        }
        if (!password) {
            return res.status(400).json({error: "Necessário uma senha"});
        }
        if (!role) {
           role = RolesEnum.STUDENT; 
        }
        if (!Object.values(RolesEnum).includes(role)) {
            return res.status(400).json({error: "Função inválida"});
        }
        const passwordHash = bcrypt.hashSync(password, 10); 
        const userCreated = await User.create({
            login,
            password: passwordHash,
            role
        });
        userCreated.password = undefined; 
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
    async delete(req, res) {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({error: "Necessário um id"});
        }
        const userDeleted = await User.findOneAndDelete({_id: id});
        if (userDeleted) {
            return res.json(userDeleted);
        } else {
            return res.status(401).json({error: "Não foi encontrado o usuário para deletar"});
        }
    },
    async patch(req, res) {
        const id = req.params.id
        const {login, password, role } = req.body;
        if (!id) {
            return res.status(400).json({error: "Necessário um id"});
        }
        let user = await User.findOne({_id: id});
        if (!user) {
            return res.status(404).json({error: "Usuário não encontrado"});
        }
        if (login) {
            user.login = login;
        }
        if (password) {
            user.password = bcrypt.hashSync(password, 10);
        }
        if (role) {
            user.role = role;
        }
        const userUpdated = await User.findOneAndUpdate(
            {_id: id},
            user);
        const newUser = {...userUpdated};
        newUser.password = undefined; // Remove a senha do objeto de resposta
        return res.json(newUser);
    },
    async login(req,res){
        const {login,password} = req.body
        const user = await User.find({login:login});

        if(!user[0]){
            return res.json({error: "Usuário não existe"});
        }
        const passwordValid = bcrypt.compareSync(password, user[0].password);
        if(passwordValid === false){
            return res.json({error: "Senha incorreta"});
        }
        if(!process.env.JWT_SECRET) {
            return res.status(500).json({error: "JWT_SECRET is not defined in environment variables"});
        }
        const token = jwt.sign({
            sub: user[0]._id,
            login: user[0].login,
            role: user[0].role
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
       
        
        console.log("Role " + user[0].role);
        return res.json({
            user: {
                id: user[0]._id,
                login: user[0].login,   
                role: user[0].role
            },
            token: token
    });
        
    }
}