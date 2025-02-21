var doorStatus = "OFF"

export default {
    getDoorStatus(req, res) {
        return res.json({doorStatus: doorStatus});
    },

    openDoor(req, res) {
        doorStatus = "ON";
        return res.json({doorStatus: doorStatus});
    },

    closeDoor(req, res) {
        doorStatus = "OFF";
        return res.json({doorStatus: doorStatus});
    }
}