var doorStatus = "close"

export default {
    getDoorStatus(req, res) {
        return res.json({doorStatus: doorStatus});
    },

    openDoor(req, res) {
        doorStatus = "open";
        return res.json({doorStatus: doorStatus});
    },

    closeDoor(req, res) {
        doorStatus = "close";
        return res.json({doorStatus: doorStatus});
    }
}