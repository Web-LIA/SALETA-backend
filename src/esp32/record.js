import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';

// Configurações
const STORAGE_DIR = './videos';
const FPS = 15;

// Cria diretório se não existir
if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR);
}

let currentVideo = {
    id: null,
    startTime: null,
    fileStream: null,
    frameCount: 0
};


function startNewVideo(id) {
    const filename = path.join(STORAGE_DIR, `session_${id}.mjpeg`);
    
    currentVideo = {
        id: id,
        startTime: Date.now(),
        fileStream: fs.createWriteStream(filename),
        frameCount: 0
    };
    
    console.log(`Novo vídeo iniciado: ${filename}`);
}

function recordFrame(latestFrame) {
    // Escreve o frame no formato MJPEG
    if (currentVideo.fileStream && currentVideo.id ) {
        const boundary = `--frame\r\nContent-Type: image/jpeg\r\nContent-Length: ${latestFrame.length}\r\n\r\n`;
        currentVideo.fileStream.write(boundary);
        currentVideo.fileStream.write(latestFrame, 'binary');
        currentVideo.fileStream.write('\r\n');
        currentVideo.frameCount++;
    }
}

function endCurrentVideo() {
    if (currentVideo.fileStream && currentVideo.id) {
        currentVideo.fileStream.end();
        console.log(`Vídeo finalizado com ${currentVideo.frameCount} frames`);
        currentVideo = {
            id: null,
            startTime: null,
            fileStream: null,
            frameCount: 0
        };
    }
}

process.on('SIGINT', () => {
    if (currentVideo.fileStream) {
        currentVideo.fileStream.end();
        console.log(`Vídeo finalizado com ${currentVideo.frameCount} frames`);
    }
    process.exit();
});
export default {
    startNewVideo,
    recordFrame,
    endCurrentVideo
}