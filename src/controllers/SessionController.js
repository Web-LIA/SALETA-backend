import mongoose from "mongoose";
import '../models/Session.js';
import '../models/Config.js'
import Mqtt_msg from "../esp32/mqtt_msg.js";
import record from "../esp32/record.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import converter from "../config/converter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const Session = mongoose.model("sessions");
const Config = mongoose.model("config");
const configId = "67be9e30a9d5c66c3fbf7398";
export default {
    async read (req, res){
        const sessionList = await Session.find();
        sessionList.map(session => {
            session.photos = [];
        });
        return res.json(sessionList);
    },

    async create(req, res) {
        const type = req.params.type;
        const userId = req.params.userId;
        const itemId = req.params.itemId;
        if (type != "guardar" && type != "buscar") {
            return res.status(400).json({error: "tipo indevido"});
        }
        // falta verificar se o userId e itemId são corretos
        const sessionCreated = await Session.create({
            type,
            userId,
            itemId
        })
         
        setTimeout(async () => {
            const config = await Config.findOne({_id: configId});
            config.lastSessionId = sessionCreated._id;
            config.save();
            await Mqtt_msg(true); // Call the function to send the door status via MQTT
            record.startNewVideo(sessionCreated._id); // Start recording the video
        }, 3000);
       
        return res.json(sessionCreated);
    },

    async getSessionId(req, res) {
        let lastSessionId = await ConfigController.lastSessionId();
        return res.json({id: lastSessionId});
    },

    async sendEspPhotos(req, res) {
        const photos = req.body.photos
        const sessionId = req.params.id
        if(!photos) {
            return res.status(400).json({error: "Fotos não recebidas"});
        } 
        const session = await Session.findOne({_id: sessionId});
        if (session.photos) {
            session.photos.push(photos);
        } 
        await session.save();
        return res.json(session);
    },

    async delete(req, res) {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({error: "Necessário um id"});
        }
        const sessionDeleted = await Session.findOneAndDelete({_id: id});
        if (sessionDeleted) {
            return res.json(sessionDeleted);
        } else {
            return res.status(401).json({error: "Não foi encontrado uma sessão para deletar"});
        }
    },
    async getVideo(req, res) {
        const sessionId = req.params.id;
        const session = await Session.findOne({_id: sessionId});
        if (!session) {
            return res.status(404).json({ error: "Sessão não encontrada" });
        }

        const videoPath = path.join(__dirname, '..', '..', 'videos', 'mp4', `session_${sessionId}.mp4`);

        fs.stat(videoPath, (err, stats) => {
            if (err) {
            console.error('Erro ao acessar arquivo:', err);
            return res.status(404).send('Vídeo não encontrado');
            }

            const fileSize = stats.size;
            const range = req.headers.range;

            if (range) {
            // Parse da range
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            if (start >= fileSize) {
                res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
                return;
            }

            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, head);
            file.pipe(res);
            } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
            }
        });
    },
    async convertVideo(req, res) {
       
        const sessionId = req.params.id;
        const session = await Session.findOne({_id: sessionId});
        if (!session) {
            return res.status(404).json({error: "Sessão não encontrada"});
        }
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const videoPath = path.join(__dirname, '..', '..', 'videos','mjpeg' ,`session_${sessionId}.mjpeg`);
        
        if (!fs.existsSync(videoPath)) {
            return res.status(404).json({error: "Vídeo não encontrado"});
        }
        try {
            const convertedFilePath = await converter(sessionId);
            console.log(`Vídeo convertido: ${convertedFilePath}`); 
            return res.json({message: "Vídeo convertido com sucesso", filePath: convertedFilePath});
        } catch (error) {
            console.error('Erro ao converter vídeo:', error);
            return res.status(500).json({error: "Erro ao converter vídeo"}); 
        }
    }
} 