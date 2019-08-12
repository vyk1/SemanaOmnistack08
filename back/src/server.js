const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');
//cria um novo server
const app = express();
// extrair o servidor http de dentro do express
// unir a um websocket
const server = require('http').Server(app);
// importante socket io
const io = require('socket.io')(server);

// não é stateless mas serve
const connectedUsers = {}

io.on('connection', socket => {
    // ASSOCIAÇÃO DE SOCKETS - PT 1 SERVER
    const { user } = socket.handshake.query
    connectedUsers[user] = socket.id;
})

//url do mongoose 
//databaseDev é o nome do BD
mongoose.connect('COPIA LINK DO MONGO COMPASS AQUI', {
    useNewUrlParser: true
});

// middleware é interceptador, como se fosse uma rota
// next faz seguir
app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
})

//cors para acessar pelo react
app.use(cors())
//reqs em json, express
app.use(express.json())
app.use(routes)
//na porta X
server.listen(3000);
