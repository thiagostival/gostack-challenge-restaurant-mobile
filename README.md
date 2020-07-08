<h2 align="center"> 
  Desafio 11: GoRestaurant Mobile
</h3>

<p align="center">

Desafio passado no GoStack bootcamp da RocketSeat, para desenvolver uma aplicação, a GoRestaurant, só que dessa vez mobile e para o cliente. Para praticar React Native junto com TypeScript, para criar um pequeno app para pedidos de comida.

</p>

<br>

<h2> 🚀 Sobre o desafio </h2>

<p>
Essa será uma aplicação que irá se conectar a uma Fake API, e exibir e filtrar os pratos de comida da API e permitir a criação de novos pedidos.
</p>

<br>

<h2>👨🏻‍💻 Execução</h2>

<p>
Para rodar o projeto, basta executar:
  <ul>
    <li> <code>$ git clone</code> - Com o link desse repositório, para clona-lo  </li>
    <li> <code>$ yarn</code> - Depois de clonado, entre na pasta do projeto clonado, e instale todas as dependências </li>
    <li> <code>$ yarn json-server server.json -p 3333</code> - Em uma aba do terminal, inicie o servidor Fake API </li>
    <li>Para executar no Android:
      <ul>
        <li> Inicie o AVD do android ou conecte seu dispositivo físico via USB </li>
        <li> <code>$ adb reverse tcp:3333 tcp:3333</code> - Em outra aba do terminal para redirecionar a porta do servidor API para do dispositivo</li>
        <li> <code>$ yarn start </code> - Em outra aba do terminal inicie o Metro Blunder </li>
        <li> <code>$ yarn android </code> - Para iniciar o aplicativo no dispositivo </li>
      </ul>
    </li>
    <li>Para executar no Iphone:
      <ul>
        <li> <code>$ yarn ios </code> - Para iniciar o aplicativo no dispositivo </li>
      </ul>
    </li>
    
  </ul>
</p>
    
<br>

<h2>Créditos</h2>

[<img src="https://avatars0.githubusercontent.com/u/28929274?s=200&v=4" alt="rocketseat" width="40" height="40" />](https://github.com/Rocketseat)
