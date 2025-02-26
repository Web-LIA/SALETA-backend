import mongoose from "mongoose";
import '../models/Config.js';
import ConfigController from "./ConfigController.js";

export default {
    async getDoorStatus(req, res) {
      let doorStatus = await ConfigController.doorStatus();
      console.log("STATUS:" + doorStatus)
        return res.json({doorStatus: doorStatus});
    },
    async openDoor(req, res) {
        await ConfigController.setDoorStatus("ON");
        return res.json({doorStatus:"PORTA ABERTA"})
    },

    async closeDoor(req, res) {
        await ConfigController.setDoorStatus("OFF");
        return res.json({doorStatus:"PORTA FECHADA"})
    }
}