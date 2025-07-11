//UDP
import dgram from 'dgram';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import expressWs from 'express-ws';
import record from '../esp32/record.js';

const app = express();
// Configurações
const UDP_PORT = 1234;
const UDP_CHUNK_SIZE = 1024; // Deve corresponder ao valor na ESP32
const MAX_FRAME_SIZE = 30000; // Ajuste conforme a resolução da câmera
const FRAME_TIMEOUT_MS = 1500; // Timeout para resetar buffer se frame travar

// Estado do servidor
let frameBuffer = null;
let expectedLength = 0;
let receivedChunks = 0;
let totalChunks = 0;
let latestFrame = null;
let frameTimeout;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Inicializa servidores
expressWs(app);

const udpServer = dgram.createSocket('udp4');

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota HTTP para streaming MJPEG
app.get('/stream', (req, res) => {
    /*  #swagger.tags = ['Video']
        #swagger.summary = 'Inicia o streaming de vídeo MJPEG'
        #swagger.description = 'Endpoint que fornece um stream de vídeo contínuo no formato MJPEG. Use em uma tag <img src="http://localhost:3333/stream"> para visualizar.'
    */
    console.log('Novo cliente MJPEG conectado');
    res.writeHead(200, {
        'Content-Type': 'multipart/x-mixed-replace; boundary=frame',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const sendFrame = () => {
        if (latestFrame) {
            try {
                res.write(`--frame\r\nContent-Type: image/jpeg\r\nContent-Length: ${latestFrame.length}\r\n\r\n`);
                res.write(latestFrame, 'binary');
                res.write('\r\n');
            } catch (err) {
                console.log('Cliente desconectado');
                clearInterval(interval);
            }
        }
    };

    const interval = setInterval(sendFrame, 100);
    req.on('close', () => {
        clearInterval(interval);
        console.log('Cliente MJPEG desconectado');
    });
});

// Rota WebSocket para streaming binário
app.ws('/ws-stream', (ws) => {
    console.log('Novo cliente WebSocket conectado');

    const sendFrame = () => {
        if (latestFrame && ws.readyState === ws.OPEN) {
            try {
                ws.send(latestFrame, { binary: true });
            } catch (err) {
                console.log('Erro no WebSocket:', err);
            }
        }
    };

    const interval = setInterval(sendFrame, 100);
    ws.on('close', () => {
        clearInterval(interval);
        console.log('Cliente WebSocket desconectado');
    });
});

// Função para resetar estado do frame
function resetFrameState() {
    frameBuffer = null;
    expectedLength = 0;
    receivedChunks = 0;
    totalChunks = 0;
    if(frameTimeout) {
        clearTimeout(frameTimeout);
        frameTimeout = null;
    }
}

udpServer.on('message', (msg, rinfo) => {
    try {
        // Sempre reseta timeout a cada pacote recebido
        if (frameTimeout) clearTimeout(frameTimeout);

        const message = msg.toString();
        if (message.startsWith("FRAME_START")) {
            const parts = message.split(":");
            if (parts.length >= 3) {
                expectedLength = parseInt(parts[1]);
                totalChunks = parseInt(parts[2]);

                if (expectedLength > MAX_FRAME_SIZE) {
                    //console.warn(`Tamanho de frame muito grande: ${expectedLength}, ignorando`);
                    resetFrameState();
                    return;
                }

                frameBuffer = Buffer.alloc(expectedLength);
                receivedChunks = 0;
                //console.log(`Novo frame iniciado. Tamanho: ${expectedLength}, Chunks: ${totalChunks}`);
            }
            // Reinicia timeout para o frame
            frameTimeout = setTimeout(() => {
                console.warn('Timeout: resetando buffer do frame');
                resetFrameState();
            }, FRAME_TIMEOUT_MS);
            return;
        }

        if (frameBuffer && receivedChunks < totalChunks) {
            const offset = receivedChunks * UDP_CHUNK_SIZE;
            const remaining = expectedLength - offset;
            const chunkSize = Math.min(UDP_CHUNK_SIZE, remaining);

            msg.copy(frameBuffer, offset, 0, chunkSize);
            receivedChunks++;

            if (receivedChunks === totalChunks) {
                latestFrame = Buffer.from(frameBuffer);
                record.recordFrame(latestFrame); // Grava vídeo
                //console.log(`Frame completo recebido. Tamanho: ${latestFrame.length}`);
                resetFrameState();
            }
        }

        // Reinicia timeout para o frame
        frameTimeout = setTimeout(() => {
            console.warn('Timeout: resetando buffer do frame');
            resetFrameState();
        }, FRAME_TIMEOUT_MS);

    } catch (err) {
        console.error('Erro no processamento UDP:', err);
        resetFrameState();
    }
});

// Tratamento de erros UDP
udpServer.on('error', (err) => {
    console.error(`Erro no servidor UDP: ${err.stack}`);
    udpServer.close();
});

function startUdpServer() {
    udpServer.bind(UDP_PORT,'0.0.0.0', () => {
        console.log(`Servidor UDP ouvindo na porta ${UDP_PORT}`);
        try {
            udpServer.setRecvBufferSize(MAX_FRAME_SIZE * 10); // buffer maior (ajuste conforme necessário)
        } catch (err) {
            console.warn('Não foi possível ajustar o buffer UDP:', err.message);
        }
    });
}

// Exporta as configurações e inicializações
export default {
    app,
    udpServer,
    startUdpServer,
    latestFrame
};
