
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const chatgpt = require('./chatgpt');
let sock, ioRef;

async function start(io) {
    ioRef = io;
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const numero = msg.key.remoteJid;
        const texto = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (texto.toLowerCase().includes('atendente')) {
            ioRef.emit('transferir_para_atendente', { numero });
            return sock.sendMessage(numero, { text: 'Você está sendo transferido para um atendente humano...' });
        }

        const resposta = await chatgpt.responder(texto);
        sock.sendMessage(numero, { text: resposta });

        ioRef.emit('mensagem_cliente', { numero, texto, resposta });
    });
}

function sendMessageToClient(numero, mensagem) {
    sock.sendMessage(numero, { text: mensagem });
}

module.exports = { start, sendMessageToClient };
