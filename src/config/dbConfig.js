import mongoose from "mongoose";

const connectionString = "mongodb+srv://ryanpimentelbr:saleta@saleta.soys9.mongodb.net/?retryWrites=true&w=majority&appName=SALETA";

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