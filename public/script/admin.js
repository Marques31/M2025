const tableBody = document.querySelector('tbody');
this.tablePlayers = [];
this.reloadTable = false;

async function main() {
    await getPlayers();
}

async function getPlayers() {
    // const eventSource = new EventSource('http://localhost:3000/getPlayers');
    const eventSource = new EventSource('https://m2025.onrender.com/getPlayers');

    eventSource.onmessage = function (event) {
        const tableList = JSON.parse(event.data);

        if (tableList.players.length !== this.tablePlayers.length || this.reloadTable) {
            tableBody.innerHTML = '';
            this.tablePlayers = tableList.players;
            montarTable();
        }
    }.bind(this);

    eventSource.onerror = function (error) {
        debugger;
    };
}

async function montarTable() {
    for (const element of this.tablePlayers) {
        const row = createTableRow(element.id, element.nome, element.role);
        tableBody.appendChild(row);
    }
    this.reloadTable = false;
}

function createTableRow(id, nome, role) {
    const tableRow = document.createElement('tr');

    const rowNumber = document.createElement('th');
    rowNumber.setAttribute('scope', 'row');
    rowNumber.setAttribute('class', 'd-none');
    rowNumber.textContent = id;
    tableRow.appendChild(rowNumber);

    const firstName = document.createElement('td');
    firstName.textContent = nome;
    tableRow.appendChild(firstName);

    const lastName = document.createElement('td');
    lastName.textContent = role;
    tableRow.appendChild(lastName);

    return tableRow;
}

function deleteAllPlayers() {
    axios
        // .post('http://localhost:3000/deleteAllPlayer')
        .post('https://m2025.onrender.com/deleteAllPlayer')
        .then(function (response) {
            console.log('jogadores deletados');
        })
        .catch(function (error) {
            console.error(error);
        })
        .finally(function () {});
}

function sortearSabotador() {
    axios
        // .post('http://localhost:3000/sortSabotador')
        .post('https://m2025.onrender.com/sortSabotador')
        .then(function (response) {
            this.reloadTable = true;
            console.log('Sabotador escolhido');
        })
        .catch(function (error) {
            console.error(error);
        })
        .finally(function () {});
}

main();
