const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9999"));

// web3.eth.defaultAccount = web3.eth.accounts[0];

var erc2viteContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"bindId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viteTokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"records","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"defaultCode","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"destoryAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_viteTokenAddress","type":"address"},{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"bindId","type":"uint256"},{"indexed":true,"name":"_ethAddr","type":"address"},{"indexed":false,"name":"_viteAddr","type":"string"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"_invitationCode","type":"uint256"}],"name":"Bind","type":"event"},{"constant":false,"inputs":[{"name":"_viteAddr","type":"string"},{"name":"_invitationCode","type":"uint256"}],"name":"bind","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_ethAddr","type":"address"}],"name":"getViteAddr","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"destory","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]);

var erc2vite = erc2viteContract.at('0xf4ffd9cc26864e5205bb30c611c216bd1707c095');

var bindEvent = erc2vite.Bind();
console.log('address', erc2vite.address);

bindEvent.watch(function(err, result){
  console.log('watch a event');
  if (!err)
    console.log(result);
    console.log(result['args']);
});

console.log('bindEvent', bindEvent);