import express from 'express';
import ItemController from './controllers/ItemController.js';
import UserController from './controllers/UsersController.js';
import Open_door from './esp32/open_door.js';
const routes = express.Router();

// ITENS
routes.get('/itens', ItemController.read);
routes.post('/itens', ItemController.create);

// USUARIOS
routes.get('/usuarios', UserController.read);
routes.post('/usuarios', UserController.create);

//Login
routes.post('/login', UserController.search )

//Esp32

routes.post('/open-door',Open_door);
export default routes;


