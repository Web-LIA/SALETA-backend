import express from 'express';
import cors from 'cors';
import connectDatabase from './config/dbConfig.js'
import routes from './routes.js';
//MQTT
import aedes from 'aedes';
import net from 'net';
import Mqtt_msg from './esp32/mqtt_msg.js';
// WebSocket
import expressWs from 'express-ws';
//UDP
import dgram from 'dgram';
//fs
import fs from 'fs';


// EXPRESS and CORS
const app = express();
app.use(cors());
app.use(express.json());


//websocket
expressWs(app);

// MONGOOSE
connectDatabase();

// broker.js MQTT
export const broker = aedes();
const mqttServer = net.createServer(broker.handle);
const mqttPort = 1883;

mqttServer.listen(mqttPort, () => {
  console.log(`MQTT broker rodando na porta ${mqttPort}`);
});
broker.on('client', async (client) => {
  console.log(`Cliente conectado: ${client.id}`);
  await Mqtt_msg();
});
broker.on('publish', async (packet, client) => {
    if (client) {
      console.log(`Mensagem recebida do cliente ${client.id}:`, packet.payload.toString());
      console.log(packet.topic);
      // Check if the topic matches the one you want to respond to
      if (packet.topic === 'config/esp32') {
        console.log(packet.topic);
        await Mqtt_msg();
      }
    }
})


//UDP 
const udpServer = dgram.createSocket('udp4');
const UDP_PORT = 1234; // Porta UDP onde a ESP32 envia os frames
// Buffer para armazenar o último frame JPEG recebido
let latestFrame = null;
const imageFragments = {};  // Armazena os fragmentos de cada imagem
let frameBuffer = null;
let expectedLength = 0;
let receivedChunks = 0;
let totalChunks = 0;
// Adicione isso no início do arquivo (após os imports)
const UDP_CHUNK_SIZE = 1024; // Mesmo valor usado no código da ESP32
// Rota HTTP para streaming MJPEG
app.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'multipart/x-mixed-replace; boundary=frame',
    'Cache-Control': 'no-cache',
  });

  const sendFrame = () => {
    if (frameBuffer && receivedChunks === totalChunks) {
      res.write(`--frame\r\nContent-Type: image/jpeg\r\nContent-Length: ${frameBuffer.length}\r\n\r\n`);
      res.write(frameBuffer, 'binary');
      res.write('\r\n');
      frameBuffer = null; // Limpa o buffer após o envio
    }
  };

  const interval = setInterval(sendFrame, 100);
  req.on('close', () => clearInterval(interval));
});

// Rota WebSocket (opcional, para streaming mais eficiente)
app.ws('/ws-stream', (ws) => {
  ws.on('message', (msg) => {
    if (latestFrame) {
      ws.send(latestFrame, { binary: true });
    }
  });
});

// Recebe dados UDP da ESP32-CAM
udpServer.on('message', (msg, rinfo) => {
  const message = msg.toString();
  
  // Verifica se é um cabeçalho de frame novo
  if (message.startsWith("FRAME_START")) {
    const parts = message.split(":");
    expectedLength = parseInt(parts[1]);
    totalChunks = parseInt(parts[2]);
    frameBuffer = Buffer.alloc(expectedLength);
    receivedChunks = 0;
    return;
  }

  // Adiciona o chunk ao buffer
  if (frameBuffer && receivedChunks < totalChunks) {
    msg.copy(frameBuffer, receivedChunks * UDP_CHUNK_SIZE);
    receivedChunks++;
  }
});
//
app.use(express.static('public'));
// Inicia o servidor UDP
udpServer.bind(UDP_PORT, () => {
  console.log(`Servidor UDP ouvindo na porta ${UDP_PORT}`);
});


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