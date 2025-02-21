import express from 'express';
import ItemController from './controllers/ItemController.js';
import UserController from './controllers/UsersController.js';
import SessionCotroller from './controllers/SessionCotroller.js';
import Open_door from './esp32/open_door.js';
const routes = express.Router();

// ITENS
routes.get('/itens', ItemController.read);
routes.post('/itens', ItemController.create);
routes.delete('/itens/:id', ItemController.delete);

// USUARIOS
routes.get('/usuarios', UserController.read);
routes.post('/usuarios', UserController.create);

// LOGIN
routes.post('/login', UserController.search )

// SESSÃO
routes.get('/sessao', SessionCotroller.read);
routes.post('/sessao/:type/:userId/:itemId', SessionCotroller.create);
routes.delete('/sessao/:id', SessionController.delete);

// ESP32
routes.post('/open-door',Open_door);

export default routes;


