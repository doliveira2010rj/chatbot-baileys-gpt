
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const baileys = require('./baileys');
const chatgpt = require('./chatgpt');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
require('dotenv').config();

app.use(express.static(__dirname + '/public'));
app.get('/painel', (req, res) => {
    res.sendFile(__dirname + '/public/painel/index.html');
});

io.on('connection', socket => {
    console.log('Painel conectado.');

    socket.on('responder_cliente', data => {
        baileys.sendMessageToClient(data.numero, data.mensagem);
    });
});

baileys.start(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
