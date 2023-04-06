const baseUrl = 'https://pokeapi.co/api/v2/pokemon';
let pokemons = [];

async function fetchData() {
    try {
        const response = await fetch(`${baseUrl}?limit=151`);
        const data = await response.json();
        const results = data.results;
        const promises = results.map(async(pokemon) => {
            const result = await fetch(pokemon.url);
            return result.json();
        });
        const pokemonData = await Promise.all(promises);
        pokemons = pokemonData.map((pokemon) => {
            const types = pokemon.types.map((type) => type.type.name);
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
            return {
                id: pokemon.id,
                name: pokemon.name,
                description: `Altura: ${pokemon.height}, Peso: ${pokemon.weight}`,
                types: types.join(', '),
                imageUrl: imageUrl,
            };
        });
        renderTable(pokemons);
    } catch (error) {
        console.log(error);
    }
}



function renderTable(pokemons) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    pokemons.forEach((pokemon) => {
        const row = `
  <tr data-id="${pokemon.id}">
    <td>${pokemon.id}</td>
    <td class="imageUrl d-none" data-imageUrl="${pokemon.imageUrl}"><img  src="${pokemon.imageUrl}" alt=""></td>
    <td class="name" data-name="${pokemon.name}">${pokemon.name}</td>´
    <td class="description" data-description="${pokemon.description}">${pokemon.description}</td>
    <td class="types" data-types="${pokemon.types}">${pokemon.types}</td>
  </tr>
`;

        tableBody.insertAdjacentHTML('beforeend', row);
    });
    addTableRowClickEvent();
}

function addTableRowClickEvent() {
    const tableRows = document.querySelectorAll('#tableBody tr');
    tableRows.forEach((row) => {
        const id = row.getAttribute('data-id');
        const name = row.querySelector('.name').getAttribute('data-name');
        const description = row.querySelector('.description').getAttribute('data-description');
        const types = row.querySelector('.types').getAttribute('data-types');
        const imageUrl = row.querySelector('.imageUrl').getAttribute('data-imageUrl');

        row.addEventListener('click', () => {
            window.location.href = `./detalles.html?id=${id}&name=${name}&description=${description}&types=${types}&imageUrl=${imageUrl}`;
        });
    });
}



function filterPokemonByName(name) {
    const filteredPokemons = pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(name.toLowerCase())
    );
    renderTable(filteredPokemons);
}


const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (event) => {
    const searchValue = event.target.value;
    filterPokemonByName(searchValue);
});

const sortBtn = document.getElementById('sortBtn');
let isSortAsc = true;
sortBtn.addEventListener('click', () => {
    if (isSortAsc) {
        pokemons.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        pokemons.sort((a, b) => b.name.localeCompare(a.name));
    }
    isSortAsc = !isSortAsc;
    renderTable(pokemons);
});


fetchData();