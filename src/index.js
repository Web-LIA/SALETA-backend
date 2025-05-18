import express from 'express';
import cors from 'cors';
import connectDatabase from './config/dbConfig.js'
import routes from './routes.js';
// WebSocket
import expressWs from 'express-ws';
// UDP e MQTT
import udpConfig from './config/udpConfig.js';
import mqttConfig from './config/mqttConfig.js';

// EXPRESS and CORS
const app = express();
app.use(cors());
app.use(express.json());

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