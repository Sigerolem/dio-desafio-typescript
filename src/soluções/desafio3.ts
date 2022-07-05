// O código abaixo tem alguns erros e não funciona como deveria. Você pode identificar quais são e corrigi-los em um arquivo TS?

let botaoAtualizar = document.getElementById('atualizar-saldo')!;
let botaoLimpar = document.getElementById('limpar-saldo')!;
let soma = document.getElementById('soma')! as HTMLInputElement;
let campoSaldo = document.getElementById('campo-saldo')!;

let valorSaldo = 0
campoSaldo.innerText = valorSaldo.toString();

function somarAoSaldo(soma: number) {
    valorSaldo += soma;
    campoSaldo.innerText = valorSaldo.toString();
}

function limparSaldo() {
    valorSaldo = 0;
    campoSaldo.innerHTML = valorSaldo.toString();
}

botaoAtualizar.addEventListener('click', function () {
  if(!isNaN(parseInt(soma.value))) {
    somarAoSaldo(parseInt(soma.value));
  }
  soma.value = ''
});

botaoLimpar.addEventListener('click', function () {
    limparSaldo();
});

/**
    <h4>Valor a ser adicionado: <input id="soma"> </h4>
    <button id="atualizar-saldo">Atualizar saldo</button>
    <button id="limpar-saldo">Limpar seu saldo</button>
    <h1>"Seu saldo é: <span id="campo-saldo"></span> "</h1>
 */