const compression = require('compression');
const express = require('express');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configurar pasta para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(compression({ filter: shouldCompress }));

function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
}

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.post('/cadastroPlayer', (req, res) => {
    const playerListFile = JSON.parse(fs.readFileSync('./playerList.json', 'utf8'));

    const newID = uuid.v4();

    playerListFile.players.push({
        id: newID,
        nome: req.body.nome,
        role: 'Em espera'
    });

    fs.writeFileSync('./playerList.json', JSON.stringify(playerListFile));

    res.send({
        MENSAGEM: 'Cadastro concluido',
        ID: newID
    });
});

app.get('/getPlayers', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
    });

    const intervalID = setInterval(() => {
        const playerListFile = JSON.parse(fs.readFileSync('./playerList.json', 'utf8'));
        res.write(`data: ${JSON.stringify(playerListFile)}\n\n`);
        res.flush();
    }, 500);

    res.on('close', () => {
        clearInterval(intervalID);
        res.end();
    });
});

app.post('/deleteAllPlayer', (req, res) => {
    fs.writeFileSync('./playerList.json', JSON.stringify({ players: [] }));
});

app.post('/sortSabotador', (req, res) => {
    const playerListFile = JSON.parse(fs.readFileSync('./playerList.json', 'utf8'));
    const sabotador = playerListFile.players[Math.floor(Math.random() * playerListFile.players.length)];

    for (const player of playerListFile.players) {
        player.role = 'Jogador';
    }

    playerListFile.players.find((e) => e.id === sabotador.id).role = 'Sabotador';

    fs.writeFileSync('./playerList.json', JSON.stringify(playerListFile));
    res.send('Sorteio concluido');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
