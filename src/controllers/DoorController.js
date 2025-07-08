import mongoose from "mongoose";
import '../models/Config.js';
import ConfigController from "./ConfigController.js";
import { broker } from '../config/mqttConfig.js';
import Mqtt_msg from "../esp32/mqtt_msg.js";
export default {
    async getDoorStatus(req, res) {
        let doorStatus = await ConfigController.doorStatus();
        console.log("STATUS:" + doorStatus)
        return res.json({doorStatus: doorStatus});
    },
    async openDoor(req, res) {
        await ConfigController.setDoorStatus("ON");
        let message = await Mqtt_msg(); // Call the function to send the door status via MQTT
        return res.json({doorStatus:"PORTA ABERTA",message})
    },

    async closeDoor(req, res) {
        await ConfigController.setDoorStatus("OFF");
        let message = await Mqtt_msg(); // Call the function to send the door status via MQTT
        await ConfigController.idChangedUpdate(false);
        return res.json({doorStatus:"PORTA FECHADA",message});
    },
    async sendDoorStatus(req, res) {
        try {
            // Fetch the door status from the database
            const item = await ConfigController.doorStatus();
            const doorStatus = item.doorStatus;

            // Publish the door status to the MQTT broker
            const topic = 'door/status';
            const message = JSON.stringify({ doorStatus });

            broker.publish({ topic, payload: message }, (err) => {
                if (err) {
                    console.error("Erro ao publicar no MQTT:", err);
                    return res.status(500).json({ error: "Erro ao enviar status via MQTT" });
                }
                console.log(`Status da porta enviado via MQTT: ${message}`);
                return res.json({ message: "Status enviado via MQTT", doorStatus });
            });
        } catch (error) {
            console.error("Erro ao buscar status da porta:", error);
            return res.status(500).json({ error: "Erro ao buscar status da porta" });
        }
    }
}