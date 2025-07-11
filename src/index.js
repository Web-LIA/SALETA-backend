import express from 'express';
import cors from 'cors';
import connectDatabase from './config/dbConfig.js'
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
// WebSocket
import expressWs from 'express-ws';
// UDP e MQTT
import udpConfig from './config/udpConfig.js';
import mqttConfig from './config/mqttConfig.js';

import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';

async function startServer() {

// EXPRESS and CORS
const app = express();
app.use(cors());
app.use(express.json());

// SWAGGER

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const swaggerJsonPath = path.join(__dirname, 'swagger-output.json');
const swaggerRaw = await fs.readFile(swaggerJsonPath, 'utf-8');
const swaggerDocument = JSON.parse(swaggerRaw || '{}');

app.use(bodyParser.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const routesModule = await import('./routes.js');
const loadRoutes = routesModule.default; // Pega a função exportada
loadRoutes(app); // Executa a função passando o 'app'




//websocket
expressWs(app);

// MONGOOSE
connectDatabase();

// MQTT
mqttConfig.mqttListen();
//UDP 
udpConfig.startUdpServer();
app.use(udpConfig.app);

// ROUTES
app.get('/', (req, res) => {
    return res.json({
        teste: "Backend Works!"
    });
});

// SERVER CONNECT
const PORT = 3333;
app.listen(PORT,'0.0.0.0' ,() =>{
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
}

startServer();