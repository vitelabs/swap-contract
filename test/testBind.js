const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9999"));

const _ = require('lodash');
const assert = require('assert');
const BigNumber = require('bignumber.js');
const { promisify } = require('es6-promisify');

// web3.eth.defaultAccount = web3.eth.accounts[0];

var erc2viteContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"bindId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viteTokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"records","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"defaultCode","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"destoryAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_viteTokenAddress","type":"address"},{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"bindId","type":"uint256"},{"indexed":true,"name":"_ethAddr","type":"address"},{"indexed":false,"name":"_viteAddr","type":"string"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"_invitationCode","type":"uint256"}],"name":"Bind","type":"event"},{"constant":false,"inputs":[{"name":"_viteAddr","type":"string"},{"name":"_invitationCode","type":"uint256"}],"name":"bind","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"destory","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]);

var erc2vite = erc2viteContract.at('0xa122d31e75ed7560b8f7daea1f3b539d02e83718');

var viteTokenContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]);

var viteToken = viteTokenContract.at('0xab1613c62a69b865e2cbd5d4b2fa8c3f06046aa9');

// console.log('erc2vite', erc2vite);

contract('Erc2Vite full test', async (accounts) => {
  const owner = accounts[0];
  const sender = accounts[1];

  let tokenAddr;
  let contractAddr;
  let destoryAddr;

  const getTokenBalanceAsync = async (addr) => {
    const tokenBalanceStr = await viteToken.balanceOf(addr);
    const balance = new BigNumber(tokenBalanceStr);
    return balance;
  };

  before(async () => {
    tokenAddr = viteToken.address;
    console.log('tokenAddr',tokenAddr);
    contractAddr = erc2vite.address;
    console.log('contractAddr', contractAddr);

    await viteToken.transfer(sender, web3.toWei(200000), {from: owner});
    await viteToken.approve(contractAddr, web3.toWei(20), {from: sender});
    const apprAmount = await viteToken.allowance(sender, contractAddr);
    console.log("apprAmount:", apprAmount);
    // await web3.eth.sendTransaction({from: owner, to: sender, value: 0, gas: 100000});

    const _tokenAddrInErc2Vite =  await erc2vite.viteTokenAddress.call();
    console.log('_tokenAddrInErc2Vite',_tokenAddrInErc2Vite);
    const _ownerInErc2Vite = await erc2vite.owner.call();
    console.log('_ownerInErc2Vite',_ownerInErc2Vite);
    const _destoryAddr = await erc2vite.destoryAddr.call();
    console.log('_destoryAddr', _destoryAddr);
  });

  it('call bind method', async () => {
      const apprAmount = await viteToken.allowance(sender, contractAddr);
      console.log("apprAmount:", apprAmount);

      const balanceBefore = await viteToken.balanceOf(sender);
      console.log('balanceBefore',balanceBefore);

      const viteAddr = "vite_098dfae02679a4ca05a4c8bf5dd00a8757f0c622bfccce7d61";
      await erc2vite.bind(viteAddr,0, {from:sender, gas: 500000});

      const balanceAfter = await getTokenBalanceAsync(sender);
      console.log('balanceAfter:', balanceAfter);
    });

  // it('watch event', async () => {
  //     const bindEvent = await erc2vite.Bind();
  //     // console.log('bind event', bindEvent);
  //     bindEvent.watch(function(err, result){
  //       console.log('watch a event');
  //       if (!err)
  //         console.log(result);
  //         console.log(result['args']);
  //       });
  //   });
});