
const axios = require('axios');
require('dotenv').config();

async function responder(pergunta) {
    try {
        const resposta = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: pergunta }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return resposta.data.choices[0].message.content.trim();
    } catch (err) {
        console.error('Erro na IA:', err.message);
        return 'Desculpe, não consegui responder no momento.';
    }
}

module.exports = { responder };
