// src/routes.mjs

import ItemController from './controllers/ItemController.js';
import UserController from './controllers/UsersController.js';
import SessionController from './controllers/SessionController.js';
import DoorController from './controllers/DoorController.js';
import ConfigController from './controllers/ConfigController.js';

import JwtAuthGuard from './guards/jwtGuard.js';
import { checkRole } from './guards/roleGuard.js';

export default function (app) {

  // ==================== ITENS ====================
 
  app.get('/itens',JwtAuthGuard,checkRole(['admin','guard']),ItemController.read /* #swagger.tags = ['Itens'] #swagger.summary = 'Listar todos os itens' #swagger.security = [{"bearerAuth": []}]*/);
  app.get('/itens/id/:id',JwtAuthGuard, ItemController.readOne /* #swagger.tags = ['Itens'] #swagger.summary = 'Obter um item específico' #swagger.security = [{"bearerAuth": []}]*/);
  app.post('/itens',JwtAuthGuard, ItemController.create /* #swagger.tags = ['Itens'] #swagger.summary = 'Cadastrar um novo item' #swagger.security = [{"bearerAuth": []}] */);
  app.delete('/itens/:id',JwtAuthGuard,checkRole(['admin']), ItemController.delete /* #swagger.tags = ['Itens'] #swagger.summary = 'Deletar um item' #swagger.security = [{"bearerAuth": []}]*/);
  app.post('/itens/found/:id',JwtAuthGuard, ItemController.updateItemFound /* #swagger.tags = ['Itens'] #swagger.summary = 'Marcar um item como encontrado' #swagger.security = [{"bearerAuth": []}] */);
  app.get('/itens/notfound', ItemController.onlyNotFound /* #swagger.tags = ['Itens'] #swagger.summary = 'Listar apenas itens não encontrados' */);
  // ==================== USUÁRIOS ====================
  app.get('/usuarios',JwtAuthGuard,checkRole(['admin']), UserController.read /* #swagger.tags = ['Usuários'] #swagger.summary = 'Listar todos os usuários' #swagger.security = [{"bearerAuth": []}]*/);
  app.post('/usuarios',JwtAuthGuard,checkRole(['admin']), UserController.create /* #swagger.tags = ['Usuários'] #swagger.summary = 'Criar um novo usuário' #swagger.security = [{"bearerAuth": []}]*/);
  app.patch('/usuarios/:id',JwtAuthGuard,checkRole(['admin']), UserController.patch /* #swagger.tags = ['Usuários'] #swagger.summary = 'Atualizar um usuário pelo id' #swagger.security = [{"bearerAuth": []}]*/);
  app.delete('/usuarios/:id',JwtAuthGuard,checkRole(['admin']), UserController.delete/* #swagger.tags = ['Usuários'] #swagger.summary = 'Deletar um usuário pelo id' #swagger.security = [{"bearerAuth": []}]*/);

  // ==================== LOGIN ====================
  app.post('/login', UserController.login /* #swagger.tags = ['Login'] #swagger.summary = 'Realizar login' */);
  app.get('/login/id',JwtAuthGuard,checkRole(['admin','guard']), UserController.id /* #swagger.tags = ['Login'] #swagger.summary = 'Obter ID do usuário logado' */);

  // ==================== SESSÃO ====================
  app.get('/sessao', JwtAuthGuard,checkRole(['admin','guard']),SessionController.read /* #swagger.tags = ['Sessão'] #swagger.summary = 'Listar todas as sessões' #swagger.security = [{"bearerAuth": []}] */);
  app.get('/sessao/id',JwtAuthGuard,checkRole(['admin','guard']), ConfigController.lastSessionId /* #swagger.tags = ['Sessão'] #swagger.summary = 'Obter o ID da última sessão'  #swagger.security = [{"bearerAuth": []}] */);
  app.post('/sessao/:type/:userId/:itemId',JwtAuthGuard, SessionController.create /* #swagger.tags = ['Sessão'] #swagger.summary = 'Criar uma nova sessão (entrada/saída)'  #swagger.security = [{"bearerAuth": []}] */);
  app.post('/sessao/:id', SessionController.sendEspPhotos /* #swagger.tags = ['Sessão'] #swagger.summary = 'Enviar fotos do ESP32 para uma sessão'  #swagger.security = [{"bearerAuth": []}] */);
  app.delete('/sessao/:id',JwtAuthGuard,checkRole(['admin','guard']), SessionController.delete /* #swagger.tags = ['Sessão'] #swagger.summary = 'Deletar uma sessão'  #swagger.security = [{"bearerAuth": []}] */);
  
  // ==================== PORTA ====================
  app.get('/porta',JwtAuthGuard,checkRole(['admin','guard']), DoorController.getDoorStatus /* #swagger.tags = ['Porta'] #swagger.summary = 'Verificar status da porta' #swagger.security = [{"bearerAuth": []}]*/);
  app.get('/portaStatus',JwtAuthGuard,checkRole(['admin','guard']), DoorController.sendDoorStatus /* #swagger.tags = ['Porta'] #swagger.summary = 'Enviar status da porta (alternativo)' #swagger.security = [{"bearerAuth": []}]*/);
  app.post('/porta/abrir',JwtAuthGuard, ConfigController.openDoor /* #swagger.tags = ['Porta'] #swagger.summary = 'Comando para abrir a porta' #swagger.security = [{"bearerAuth": []}]*/);
  app.post('/porta/fechar',JwtAuthGuard, ConfigController.closeDoor /* #swagger.tags = ['Porta'] #swagger.summary = 'Comando para fechar a porta'#swagger.security = [{"bearerAuth": []}] */);
  
  // ==================== VIDEO ====================
  app.get('/video/:id',JwtAuthGuard,checkRole(['admin','guard']), SessionController.getVideo /* #swagger.tags = ['Video'] #swagger.summary = 'Obter vídeo de uma sessão' #swagger.security = [{"bearerAuth": []}]*/);
  app.get('/video/convert/:id',JwtAuthGuard,checkRole(['admin','guard']), SessionController.convertVideo /* #swagger.tags = ['Video'] #swagger.summary = 'Converter vídeo de uma sessão' #swagger.security = [{"bearerAuth": []}]*/);

  // ==================== CONFIGURAÇÃO ====================
  app.get('/config',JwtAuthGuard,checkRole(['admin']), ConfigController.read /* #swagger.tags = ['Configuração'] #swagger.summary = 'Ler configurações do sistema' #swagger.security = [{"bearerAuth": []}]*/);
  app.post('/config',JwtAuthGuard,checkRole(['admin']), ConfigController.create /* #swagger.tags = ['Configuração'] #swagger.summary = 'Criar/Atualizar configurações do sistema' #swagger.security = [{"bearerAuth": []}]*/);
}