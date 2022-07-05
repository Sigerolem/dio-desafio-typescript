// Um desenvolvedor tentou criar um projeto que consome a base de dados de filme do TMDB para criar um organizador de filmes, mas desistiu 
// pois considerou o seu código inviável. Você consegue usar typescript para organizar esse código e a partir daí aprimorar o que foi feito?

// A ideia dessa atividade é criar um aplicativo que: 
//    - Busca filmes
//    - Apresenta uma lista com os resultados pesquisados
//    - Permite a criação de listas de filmes e a posterior adição de filmes nela

// Todas as requisições necessárias para as atividades acima já estão prontas, mas a implementação delas ficou pela metade (não vou dar tudo de graça).
// Atenção para o listener do botão login-button que devolve o sessionID do usuário
// É necessário fazer um cadastro no https://www.themoviedb.org/ e seguir a documentação do site para entender como gera uma API key https://developers.themoviedb.org/3/getting-started/introduction

type MovieType = {
  id: number;
  adult: boolean;
  poster_path: string;
  original_title: string;
  vote_average: number;
}

type ListsType = {
  description: string;
  id: number;
  name: string;
  list_type: string;
}

type LoginRequestBodyType = {
  username: string;
  password: string;
  request_token: string;
}

let apiKey = '';
let requestToken: string;
let username = '';
let userId: number;
let password: string;
let sessionId = '';
let listas = [] as ListsType[]
let listId = 0;

let newListname = '';
let newListDescription = '';

let loginButton = document.getElementById('login-button')! as HTMLButtonElement;
let searchContainer = document.getElementById('search-container')!;
let searchInput = document.getElementById('search') as HTMLInputElement;
let searchButton = document.getElementById('search-button')!;
let listsContainer = document.getElementById('lists-container')!;
let listsButton = document.getElementById('lists-button')! as HTMLButtonElement;
let newListButton = document.getElementById('new-list-button')! as HTMLButtonElement;

class HttpClient {
  static async get({url, method, body = null}: {
    body?: null | string | LoginRequestBodyType | { media_id: string } | {name: string, description: string, language: string}, 
    method: string, 
    url: string
  } ) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open(method, url, true);
      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
      }
      request.onerror = () => {
        reject({
          status: request.status,
          statusText: request.statusText
        })
      }
      if (body) {
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        body = JSON.stringify(body);
      }
      request.send(body);
    })
  }
}

loginButton.addEventListener('click', async () => {
  await criarRequestToken();
  await logar();
  await criarSessao();
  await pegarDetalhes();
  listsButton.disabled = sessionId == '';
})

searchButton.addEventListener('click', async () => {
  let lista = document.getElementById("lista-pesquisa");
  if (lista) {
    lista.innerHTML = "";
  } else {
    let ul = document.createElement('ul');
    ul.id = "lista-pesquisa"
    lista = ul
  }
  let query = searchInput.value;
  let disabledAddButton = listId == 0
  let listaDeFilmes = await procurarFilme(query);
  for (const item of listaDeFilmes.results) {
    let li = document.createElement('li');
    li.innerHTML = `${item.original_title}
      <button ${disabledAddButton && 'disabled'} onclick="adicionarFilmeNaLista(${item.id})">+</button>
    `
    lista.appendChild(li)
  }
  console.log(listaDeFilmes);
  searchContainer.appendChild(lista);
})

listsButton.addEventListener('click', async () => {
  await verListas()
  let listagemDeListas = document.getElementById('lists')
  let itensLista = document.getElementById('lista-itens')
  let h3Lista = document.getElementsByTagName('h3')[0]
  if (itensLista){
    itensLista.innerHTML = ''
    h3Lista.innerHTML = ''
  }
  if (listagemDeListas) {
    listagemDeListas.innerHTML = ''
  } else {
    let ul = document.createElement('ul');
    ul.id = "lists"
    listagemDeListas = ul
  }
  for (const item of listas) {
    let li = document.createElement('li');
    li.innerHTML = `<span style="margin-right: 15px;">${item.name}</span>
    <button onClick={pegarLista(${item.id})}>Selecionar</button>
    `
    listagemDeListas.appendChild(li)
  }
  listsContainer.appendChild(listagemDeListas)
  listId = 0
})

newListButton.addEventListener('click', async () => {
  criarLista()
})

function preencherSenha() {
  let passwordInput = document.getElementById('senha') as HTMLInputElement;
  password = passwordInput.value;
  validateLoginButton();
}

function preencherLogin() {
  let usernameInput = document.getElementById('login') as HTMLInputElement;
  username = usernameInput.value;
  validateLoginButton();
}

function preencherApi() {
  let apiKeyInput = document.getElementById('api-key') as HTMLInputElement;
  apiKey = apiKeyInput.value;
  validateLoginButton();
}

function validateLoginButton() {
  if (password && username && apiKey) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

function preencherListName() {
  let listNameInput = document.getElementById('list-name') as HTMLInputElement;
  newListname = listNameInput.value;
  validateAddListButton()
}

function preencherListDescription() {
  let listDescriptionInput = document.getElementById('list-description') as HTMLInputElement;
  newListDescription = listDescriptionInput.value;
  validateAddListButton()
}

function validateAddListButton() {
  if (newListname != '' && newListDescription != '' && sessionId != '') {
    newListButton.disabled = false;
  } else {
    newListButton.disabled = true;
  }
}

async function procurarFilme(query: string) {
  query = encodeURI(query)
  console.log(query)
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    method: "GET"
  }) as {page: number, results: MovieType[], total_pages: number}
  return result
}

async function criarRequestToken () {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    method: "GET"
  }) as {request_token: string} 
  requestToken = result.request_token
}

async function logar() {
  await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    method: "POST",
    body: {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`
    }
  })  
}

async function criarSessao() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    method: "GET"
  }) as { session_id: string}
  sessionId = result.session_id;
}

async function pegarDetalhes() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&session_id=${sessionId}`,
    method: "GET"
  }) as { id: number, name: string }
  userId = result.id;
}

async function verListas() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/account/${userId}/lists?api_key=${apiKey}&language=en-US&session_id=${sessionId}&page=1`,
    method: "GET"
  }) as { page: number, results: ListsType[], total_results: number }
  listas = result.results
}

async function criarLista() {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      name: newListname,
      description: newListDescription,
      language: "pt-br"
    }
  })
  console.log(result);
}

async function adicionarFilmeNaLista(filmeId: string) {
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    method: "POST",
    body: {
      media_id: filmeId
    }
  })
  console.log(result);
}

async function pegarLista(id: number) {
  listId = id;
  let result = await HttpClient.get({
    url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    method: "GET"
  }) as { description: string, name: string, items: MovieType[]}
  let lists = document.getElementById('lists')!
  lists.innerHTML = ''
  let ul = document.getElementById('lista-itens')
  let h3 = document.getElementsByTagName('h3')[0]
  if(ul != null && h3 != null){
    ul.innerHTML = ''
    h3.innerHTML = ''
  } else {
    h3 = document.createElement('h3')
    ul = document.createElement('ul')
    ul.id = 'lista-itens'
  }
  h3.innerText = `${result.name}`
  for (let item of result.items) {
    let li = document.createElement('li')
    li.innerText = `${item.original_title}`
    ul.appendChild(li)
  }
  listsContainer.appendChild(h3)
  listsContainer.appendChild(ul)
}


{/*<div style="display: flex; flex-wrap: wrap; gap: 40px">
        <div
            style="display: flex; width: 300px; height: 120px; justify-content: space-between; flex-direction: column;">
            <input id="login" placeholder="Login" onchange="preencherLogin(event)">
            <input id="senha" placeholder="Senha" type="password" onchange="preencherSenha(event)">
            <input id="api-key" placeholder="Api Key" onchange="preencherApi()">
            <button id="login-button" disabled>Login</button>
        </div>
        <div id="search-container" style="max-width: 400px;">
            <input id="search" placeholder="Escreva...">
            <button id="search-button">Pesquisar Filme</button>
        </div>
        <div id="lists-container">
            <button id="lists-button" disabled>See Created Lists</button>
        </div>
        <div
            style="display: flex; width: 300px; height: 120px; justify-content: space-between; flex-direction: column;">
            <input id="list-name" placeholder="Nome" onchange="preencherListName(event)">
            <input id="list-description" placeholder="Descrição" type="text" onchange="preencherListDescription(event)">
            <button id="new-list-button" disabled>Criar lista</button>
        </div>
    </div>*/}