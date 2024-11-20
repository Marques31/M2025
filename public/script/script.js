const app = document.getElementById('typewriter');
const element = document.getElementById('inputPass');

const typewriter = new Typewriter(app, {
    loop: false,
    delay: 75
});

typewriter
    .pauseFor(1500)
    .typeString('Olá Família <br/> <br/>')
    .pauseFor(300)
    .typeString('Boas-vindas a mais um ano de aventuras e desafios! Desejamos a você um Feliz Ano Novo repleto de realizações e novas conquistas. <br/>')
    .typeString('Para continuarmos juntos nessa jornada, solicitamos que você insira sua senha')
    .pauseFor(1000)
    .callFunction(() => {
        element.classList.remove('d-none'); // Replace 'myClass' with the class you want to remove
    })
    .start();

// Função para mostrar o elemento
function showInput() {}
