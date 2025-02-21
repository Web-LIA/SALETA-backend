var doorStatus = "open"

export default {
    getDoorStatus(req, res) {
        return res.json({doorStatus: doorStatus});
    },

    openDoor(req, res) {
        doorStatus = "open";
    },

    closeDoor(req, res) {
        doorStatus = "close";
    }
}