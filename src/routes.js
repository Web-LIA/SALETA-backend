import express from 'express';
import ItemController from './controllers/ItemController.js';
import UserController from './controllers/UsersController.js';
import SessionController from './controllers/SessionController.js';
import DoorController from './controllers/DoorController.js';
// import Open_door from './esp32/open_door.js';
const routes = express.Router();

// ITENS
routes.get('/itens', ItemController.read);
routes.post('/itens', ItemController.create);
routes.delete('/itens/:id', ItemController.delete);
routes.post('/item/found/:id', ItemController.updateItemFound);

// USUARIOS
routes.get('/usuarios', UserController.read);
routes.post('/usuarios', UserController.create);

// LOGIN
routes.post('/login', UserController.search )

// SESSÃO
routes.get('/sessao', SessionController.read);
routes.get('/sessao/id', SessionController.getSessionId);
routes.post('/sessao/:type/:userId/:itemId', SessionController.create);
routes.post('/sessao/:id', SessionController.sendEspPhotos);
routes.delete('/sessao/:id', SessionController.delete);

// ESP32
// routes.post('/open-door',Open_door);
routes.get('/porta', DoorController.getDoorStatus);
routes.post('/porta/abrir', DoorController.openDoor);
routes.post('/porta/fechar', DoorController.closeDoor);

export default routes;


