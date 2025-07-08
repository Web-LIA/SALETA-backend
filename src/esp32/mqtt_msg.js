import { broker } from "../config/mqttConfig.js";
import ConfigController from "../controllers/ConfigController.js";

export default async function  Mqtt_msg( idChanged =false ) { 
     try {
        // Fetch the door status from the database
        const item = await ConfigController.doorStatus();
        const doorStatus = item.doorStatus;
        const lastSessionId = item.lastSessionId;

        if(idChanged){
           await ConfigController.idChangedUpdate(idChanged);
        }else{
            // If idChanged is false, we can assume the door status has not changed
            idChanged = await ConfigController.idChanged();
        }
        // Publish the door status to the MQTT broker
        const topic = 'config/esp32';
        const message = JSON.stringify({ doorStatus , lastSessionId,idChanged });

        broker.publish({ topic, payload: message }, (err) => {
            if (err) {
                console.error("Erro ao publicar no MQTT:", err);
                return { error: "Erro ao enviar status via MQTT" };
            }
            console.log(`Status da porta enviado via MQTT: ${message}`);
            return { message: "Status enviado via MQTT", doorStatus };
        });
    } catch (error) {
        console.error("Erro ao buscar status da porta:", error);
        return { error: "Erro ao buscar status da porta",status: 500 };
    }

}
