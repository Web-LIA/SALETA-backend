import axios from "axios"
import http from "http"
import fs from "fs"
// Replace with your ESP32-CAM's IP address

const ESP32_IP = "192.168.3.112"

export default function Open_door(req, res){
    let {requisicao} = req.body;
    if(!requisicao)return res.json({error:"NAO TEM REQUISIÇÃO"})
    if(requisicao != "ON" && requisicao != "OFF"){
        return res.json({error: "REQUISIÇÃO ERRADA"});
    }


    // Function to send a command to the ESP32-CAM
    async function sendCommand(command) {
    try {
        const response = await axios.get(`http://${ESP32_IP}/control?cmd=${command}`);
        console.log(`Command "${command}" response:`, response.data);
    } catch (error) {
        console.error(`Error sending command "${command}":`, error.message);
    }
    }

    // Function to fetch the video stream
    function fetchVideoStream() {
    // Create a writable stream to save the video stream
    const fileStream = fs.createWriteStream('video_stream.mjpeg');

    // Send an HTTP GET request to the /stream endpoint
    http.get(`http://${ESP32_IP}/stream`, (response) => {
        console.log('Streaming started...');

        // Pipe the response data to a file
        response.pipe(fileStream);

        // Handle stream end
        response.on('end', () => {
        console.log('Stream ended.');
        });

        // Handle errors
        response.on('error', (err) => {
        console.error('Error streaming video:', err.message);
        });
    });
    }

    async function porta(comand) {
        // Send a command to turn the GPIO pin ON
        

        /* 
        LOGICA INVERTIDA
        OFF = ABRIR PORTA
        ON = FECHAR PORTA
        
        */
        switch(comand){
            case "ON":
                await sendCommand('OFF');

                // Wait for 2 seconds
                await new Promise((resolve) => setTimeout(resolve, 10000));
        
                // Send a command to turn the GPIO pin OFF
                await sendCommand('ON');
                break;
            case "OFF":
                await sendCommand('ON');
                break;
        }
       
    }
    porta(requisicao);

    return  res.json({results:"ABRIU A PORTA"})
}