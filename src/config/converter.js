import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolvendo o caminho do arquivo atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Converte um vídeo para MP4 com codec libx264
 * @returns {Promise<void>} - Promise que resolve quando a conversão termina ou rejeita em erro
 */
async function converter(id) {
  const inputPath = path.join(__dirname, `../../videos/mjpeg/session_${id}.mjpeg`);
  const outputPath = path.join(__dirname, `../../videos/mp4/session_${id}.mp4`);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilters('transpose=1') // 👈 gira 90 graus sentido horário
      .outputOptions([
        '-c:v libx264',
        '-pix_fmt yuv420p',
        '-movflags +faststart'
      ])
      .on('start', commandLine => {
        console.log('Iniciando FFmpeg:', commandLine);
      })
      .on('progress', progress => {
        console.log(`Progresso: ${progress.percent ? progress.percent.toFixed(2) : 0}%`);
      })
      .on('error', (err, stdout, stderr) => {
        console.error('Erro ao converter vídeo:', err.message);
        reject(err);
      })
      .on('end', () => {
        console.log('Conversão concluída!');
        resolve();
      })
      .save(outputPath);
  });
}


export default converter;
// Exemplo de uso
// converterVideo('input.mjpeg', 'output.mp4').catch(console.error);
