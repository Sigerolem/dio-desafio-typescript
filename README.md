# Desafios solucionados de Typescript
  
*Bem vindo!!*

O objetivo desse repositório é mostrar exemplos e desafios de typescript que vão dar uma noção geral suficiente da ferramenta para que ela seja usada no dia a dia do desenvolvedor.
  
## Do que foi necessário
Ferramentas necessárias:  
* Do Node instalado na máquina
* De uma IDE como o visual studio code  

Requisitos técnicos:  
* Lógica de programação
* Mas é melhor ainda se tiver um conhecimento básico de javascript  

## Estrutura do repositório inicial
* *src* 
    * Contém arquivos com exemplos de uso de TS e JS comentados para facilitar o entendimento da ferramenta
* *desafios*
    * Contém vários arquivos JS que podem ser refatorados para solidificar o conhecimento adquirido na aula
* *soluções*
    * Contém vários arquivos TS que são considerados resoluções para so desafios propostos
* *index.html*
    * É onde está a chamada para o arquivo app.js e pode ser manipulado a vontade para testarem seus scripts
* *tsconfig.json*
    * O coração do TS que configura suas funcionalidades.  
* *package.json*
    * Nesse arquivo foram colocados alguns scripts com o propósito de facilitar a vida de quem usar esse repositório
        * start
            * Inicia o *lite-server*, que vai escutar modificações no index.html e em seus arquivos importados. É útil caso queira fazer testes no browser. A porta disposta normalmente é a *localhost:3000*
        * watch  
            * Roda o *tsc --watch* com o propósito de compilar constantemente qualquer coisa que for editada nos arquivos TS para sua contraparte em JS. Esse comando evita que *tsc* tenha que ser digitado constantemente para fazer a compilação.  

## Sobre a resolução dos desafios
Os desafios foram solucionados seguindo os requisitos propostos da maneira mais direta e simples possivel. Não foipensado em modos de otimizar os processos e nem foi pensado em fazer uso de frameworks como o React que facilitariam muito o processo além de entregar um resultado muito mais organizado.
O objetivo foi apenas fazer exercicio da lógica e dos conhecimentos de typescript para superar os desafios.

### Observações
Realizar o desafio 4, o mais complexo dentre os propostos, me fez perceber o poder que pode ser ganho com o uso de bibliotecas especializadas para a solução de problemas no dia a dia. Se os desafios não tivessem como principal objetivo, o teste de logica e de noções de typescript, eu faria diferente.
Como utilizar bibliotecas melhores para consumir a API do movies.db e faria uso de React para uma melhor componentização do codigo.