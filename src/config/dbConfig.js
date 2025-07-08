import mongoose from "mongoose";
import { connectionString } from "../api/api_keys.js";

const connectDatabase = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log("Conectado com o atlas");
    }
    catch (error) {
        console.log("Erro ao conectar com o atlas: " + error);
    }
};

export default connectDatabase;