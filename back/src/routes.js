const express = require('express');
const DevController = require('./controllers/DevController')
const LikeController = require('./controllers/LikeController')
const DisLikeController = require('./controllers/DisLikeController')
const routes = express.Router();
//request e response como params
// routes.get('/', (req, res) => {
    //todos os params que vem da query
    //precisa usar localhost:3000/?name=jorge
    // return res.send(`Olá ${req.query.name}`);
    //melhor em objeto ou array
    // return res.json({ message: `Olá ${req.query.name}` });
// });

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);
routes.post('/devs/:devId/likes', LikeController.store);
routes.post('/devs/:devId/dislikes', DisLikeController.store);

module.exports = routes;