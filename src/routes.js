import express from 'express';
import ItemController from './controllers/ItemController.js';
import UserController from './controllers/UsersController.js';
import SessionController from './controllers/SessionController.js';
import DoorController from './controllers/DoorController.js';
import ConfigController from './controllers/ConfigController.js'
// import Open_door from './esp32/open_door.js';
const routes = express.Router();

// ITENS
routes.get('/itens', ItemController.read);
routes.get('/itens/:id', ItemController.readOne);
routes.post('/itens', ItemController.create);
routes.delete('/itens/:id', ItemController.delete);
routes.post('/itens/found/:id', ItemController.updateItemFound);

// USUARIOS
routes.get('/usuarios', UserController.read);
routes.post('/usuarios', UserController.create);

// LOGIN
routes.post('/login', UserController.search )
routes.get('/login/id',UserController.id);

// SESSÃO
routes.get('/sessao', SessionController.read);
routes.get('/sessao/id', ConfigController.lastSessionId);
routes.post('/sessao/:type/:userId/:itemId', SessionController.create);
routes.post('/sessao/:id', SessionController.sendEspPhotos);
routes.delete('/sessao/:id', SessionController.delete);

// ESP32
// routes.post('/open-door',Open_door);
routes.get('/porta', ConfigController.doorStatus);
routes.post('/porta/abrir', ConfigController.openDoor);
routes.post('/porta/fechar', ConfigController.closeDoor);

//CONFIG

routes.get('/config',ConfigController.read);
routes.post('/config',ConfigController.create);

export default routes;


