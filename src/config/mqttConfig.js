import aedes from 'aedes';
import net from 'net';
import Mqtt_msg from '../esp32/mqtt_msg.js';
import record from '../esp32/record.js';
import ConfigController from '../controllers/ConfigController.js';
export const broker = aedes();
const mqttServer = net.createServer(broker.handle);
const mqttPort = 1883;


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
      if(packet.topic === "session/esp32") {
        console.log(packet);
        record.endCurrentVideo();
        await ConfigController.idChangedUpdate(false);
      }
    }
})
function mqttListen() {
  mqttServer.listen(mqttPort,'0.0.0.0', () => {
    console.log(`MQTT broker rodando na porta ${mqttPort}`);
  });
}
export default {
    mqttServer,
    mqttListen
}