import { broker } from "../config/mqttConfig.js";
import ConfigController from "../controllers/ConfigController.js";

// Espera por ack no tópico "config/esp32/ack"
function waitForAck(expectedSessionId, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const onMessage = (topic, payload) => {
            if (topic === "config/esp32/ack") {
                try {
                    const msg = JSON.parse(payload.toString());
                    if (msg.lastSessionId === expectedSessionId && msg.ack === true) {
                        broker.removeListener("message", onMessage);
                        resolve(msg);
                    }
                } catch (err) {
                    // Ignora erro de parsing
                }
            }
        };

        broker.on("message", onMessage);

        const timer = setTimeout(() => {
            broker.removeListener("message", onMessage);
            reject(new Error("Ack não recebido dentro do tempo limite"));
        }, timeout);
    });
}

export default async function Mqtt_msg(idChanged = false, maxAttempts = 5) {
    try {
        const item = await ConfigController.doorStatus();
        const doorStatus = item.doorStatus;
        const lastSessionId = item.lastSessionId;

        const topic = "config/esp32";
        const message = JSON.stringify({ doorStatus, lastSessionId, idChanged });

        // Garante que o cliente está inscrito para receber o ack
        broker.subscribe("config/esp32/ack");

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            console.log(`Tentativa ${attempt} de envio MQTT...`);
            broker.publish(topic, message);

            try {
                const ack = await waitForAck(lastSessionId, 5000); // aguarda 5s
                console.log("Ack recebido:", ack);
                return {
                    message: `Status enviado e ack recebido na tentativa ${attempt}`,
                    doorStatus,
                    ack
                };
            } catch (err) {
                console.warn(`Tentativa ${attempt} falhou: ${err.message}`);
                if (attempt < maxAttempts) {
                    await new Promise(r => setTimeout(r, 1000)); // espera 1s antes de tentar de novo
                }
            }
        }

        return {
            error: "Não foi possível receber ack após várias tentativas",
            status: 408
        };

    } catch (error) {
        console.error("Erro geral ao enviar status via MQTT:", error);
        return {
            error: "Erro interno ao buscar status da porta ou enviar mensagem",
            status: 500
        };
    }
}
