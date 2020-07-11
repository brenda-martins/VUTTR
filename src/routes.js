const routes = require('express').Router();

const ToolController = require('./app/controllers/ToolController');
const AuthController = require('./app/controllers/AuthController');
const { router } = require('./app');
const authMiddleware = require("./app/middlewares/auth");

routes.post('/auth', AuthController.auth);

routes.use(authMiddleware);

routes.get('/tools', ToolController.index);
routes.post('/tools', ToolController.store);
routes.delete('/tools/:id', ToolController.delete);




module.exports = routes;