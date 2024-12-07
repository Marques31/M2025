const app = document.getElementById('typewriter');
const inputPass = document.getElementById('inputPass');
const inputNome = document.getElementById('inputNome');
const boasVindas = document.getElementById('boasVindas');
const waiting = document.getElementById('waiting');
const playerHMTL = document.getElementById('player');
const playerType = document.getElementById('playerType');

this.myPlayerID;
this.role = 'Em espera';

const typewriter = new Typewriter(app, {
    loop: false,
    delay: 75
});

typewriter
    .pauseFor(0) // 1500
    .typeString('Olá Família, <br/> <br/>')
    .pauseFor(0) // 300
    .typeString('Boas-vindas a mais um ano de aventuras e desafios! Desejamos a você um Feliz Ano Novo repleto de realizações e novas conquistas. <br/>')
    .typeString('Para continuarmos juntos nessa jornada, solicitamos que você insira sua senha')
    .pauseFor(0) // 1000
    .callFunction(() => {
        inputPass.classList.remove('d-none');
        inputNome.classList.remove('d-none');
    })
    .start();

// Função para mostrar o elemento
function sendInput() {
    const nome = document.getElementById('nome');
    const pass = document.getElementById('pass');

    if (nome.value === '') nome.classList.add('is-invalid');
    else nome.classList.remove('is-invalid');

    if (pass.value === '') pass.classList.add('is-invalid');
    else pass.classList.remove('is-invalid');

    if (pass.value === '' || nome.value === '') return;

    const payload = {
        nome: nome.value,
        senha: pass.value
    };

    axios
        .post('http://localhost:3000/cadastroPlayer', payload)
        .then(function (response) {
            this.myPlayerID = response.data.ID;
            boasVindas.classList.add('d-none');
            waiting.classList.remove('d-none');
        })
        .catch(function (error) {
            console.error(error);
        })
        .finally(function () {
            gameStart(this.myPlayerID);
        });
}

function gameStart(playerID) {
    const eventSource = new EventSource('http://localhost:3000/getPlayers');

    eventSource.onmessage = function (event) {
        const tableList = JSON.parse(event.data);
        const player = tableList.players.find((e) => e.id === this.myPlayerID);

        if (player.role !== this.role) {
            if (this.role === 'Em espera') waiting.classList.add('d-none');

            playerType.innerText = player.role;
            playerHMTL.classList.remove('d-none');
            this.role = player.role;
        }
    }.bind(this);

    eventSource.onerror = function (error) {
        debugger;
    };
}
