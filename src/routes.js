import express from 'express';
import ItemController from './controllers/ItemController.js';
import UserController from './controllers/UsersController.js';
const routes = express.Router();

// ITENS
routes.get('/itens', ItemController.read);
routes.post('/itens', ItemController.create);

// USUARIOS
routes.get('/usuarios', UserController.read);
routes.post('/usuarios', UserController.create);
export default routes;
