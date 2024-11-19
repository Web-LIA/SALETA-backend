import express from 'express';
import cors from 'cors';
import connectDatabase from './config/dbConfig.js'
import routes from './routes.js';

// EXPRESS and CORS
const app = express();
app.use(cors());
app.use(express.json());

// MONGOOSE
connectDatabase();

// ROUTES
app.use(routes);
app.get('/', (req, res) => {
    return res.json({
        teste: "Backend Works!"
    });
});

// SERVER CONNECT
const PORT = 3333;
app.listen(PORT, () =>{
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});