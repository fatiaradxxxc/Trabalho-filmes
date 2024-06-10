// Chave da API para acesso ao OMDB
const apiKey = 'b66cf975';

// Seleciona os elementos do formulário de pesquisa e o formulário de pesquisa na tabela
const formPesquisa = document.querySelector('#pesquisa');
const formTabela = document.querySelector('#pesquisa-tabela');

// Seleciona o botão para alternar entre os modos claro e escuro
const btnDarkMoke = document.querySelector('#light-mode');

// Seleciona a lista onde os filmes serão exibidos
const list = document.querySelector('.list');

// Função para criar e adicionar um link de CSS para o modo claro
function criarLinkCSS() {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'assets/css/light-mode.css');
    link.setAttribute('id', 'dark-mode-css');
    document.querySelector('head').appendChild(link);
}

// Função para mudar a aparência do botão de alternância entre modos
function mudarAparenciaBotao(mode) {
    if (mode === 'dark') {
        btnDarkMoke.innerHTML = '<i class="fa-regular fa-moon"></i>';
        btnDarkMoke.id = 'dark-mode';
    } else if (mode === 'light') {
        btnDarkMoke.innerHTML = '<i class="fa-solid fa-sun"></i>';
        btnDarkMoke.id = 'light-mode';
    }
}

// Adiciona um evento de clique ao botão para alternar entre os modos claro e escuro
btnDarkMoke.addEventListener('click', () => {
    if (btnDarkMoke.id === 'light-mode') {
        criarLinkCSS();
        mudarAparenciaBotao('dark');
    } else {
        document.querySelector('#dark-mode-css').remove();
        mudarAparenciaBotao('light');
    }
});

// Função para carregar a lista de filmes a partir do JSON retornado pela API
function loadList(json) {
    // Limpa a lista antes de carregar novos itens
    list.innerHTML = '';

    // Exibe mensagem se nenhum filme for encontrado
    if (json.Response === 'False') {
        list.innerHTML = '<p>Nenhum filme encontrado</p>';
        return;
    }

    // Para cada filme encontrado, cria um item na lista
    json.Search.forEach(element => {
        const item = document.createElement('td');
        item.classList.add('item');
        item.setAttribute('style', `background: url("${element.Poster}");`);

        // Adiciona as informações do filme e um link para mais detalhes
        item.innerHTML += `
            <div id='movie-info'>
                <h2>${element.Title}</h2>
                <p>${element.Year}</p>
            </div>
            <a href="http://www.omdbapi.com/?t=${element.Title}&apikey=${apiKey}">Info</a>
        `;

        // Adiciona o item à lista
        list.appendChild(item);
    });
}

// Evento de envio do formulário de pesquisa de filmes
formPesquisa.onsubmit = (ev) => {
    ev.preventDefault();

    // Obtém o termo de pesquisa do campo de entrada
    const pesquisa = ev.target.pesquisa.value;

    // Exibe um alerta se o campo de pesquisa estiver vazio
    if (pesquisa === '') {
        alert('Preencha o campo!');
        return;
    }

    // Faz uma requisição à API OMDB para buscar filmes
    fetch(`https://www.omdbapi.com/?s=${pesquisa}&apikey=${apiKey}`)
        .then(result => result.json())
        .then(json => loadList(json)) // Carrega a lista de filmes com os dados recebidos
        .catch(error => console.error('Erro na busca:', error)); // Exibe erro no console em caso de falha
};

// Evento de envio do formulário de pesquisa na tabela
formTabela.onsubmit = (ev) => {
    ev.preventDefault();

    // Obtém o termo de pesquisa do campo de entrada e converte para minúsculas
    const pesquisa = ev.target.pesquisaTabela.value.toLowerCase();

    // Seleciona todos os elementos 'td' na tabela
    const tdList = document.querySelectorAll('td');

    // Para cada elemento 'td', remove a classe de destaque
    tdList.forEach(element => {
        element.classList.remove('highlight');

        if(element) {
            // Obtém o nome do filme do elemento e converte para minúsculas
            const nomeFilme = element.firstChild.nextSibling.firstChild.nextSibling.innerHTML.toLowerCase();
            
            // Adiciona a classe de destaque se o nome do filme corresponder ao termo de pesquisa
            if (nomeFilme === pesquisa) {
                element.classList.add('highlight');
            }
        }
    });
}
