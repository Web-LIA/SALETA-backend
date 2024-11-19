import express from 'express';
import ItemController from './controllers/ItemController.js';

const routes = express.Router();

// ITENS
routes.get('/itens', ItemController.read);
routes.post('/itens', ItemController.create);

export default routes;
