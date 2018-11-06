
const _ = require('lodash');
const assert = require('assert');
const BigNumber = require('bignumber.js');
const { promisify } = require('es6-promisify');

const Erc2Vite = artifacts.require("./Erc2Vite.sol");
const ViteToken    = artifacts.require("./ViteToken.sol");

contract('Erc2Vite full test', async (accounts) => {
  const owner = accounts[0];
  const sender = accounts[1];

  let viteToken;
  let erc2vite;
  let tokenAddr;
  let contractAddr;
  let destoryAddr;

  const getTokenBalanceAsync = async (addr) => {
    const tokenBalanceStr = await viteToken.balanceOf(addr);
    const balance = new BigNumber(tokenBalanceStr);
    return balance;
  };

  // const sendTransaction = web3.eth.sendTransaction;
  // const getTransactionReceipt = web3.eth.getTransactionReceipt;

  before(async () => {
    viteToken = await ViteToken.deployed();
    erc2vite = await Erc2Vite.deployed();
    tokenAddr = viteToken.address;
    contractAddr = erc2vite.address;
    console.log('tokenAddr', tokenAddr);

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

  describe('Erc2Vite: ', async () => {

    it('user should not destory the program.', async () => {
      try {
        await erc2vite.destory({from: sender, gas: 500000});
        throw new Error('destoried by user, not owner');
      } catch (err) {
        assert(true, 'destoried by user should have thrown');
      }
    });

    it('call bind method', async () => {
      const apprAmount = await viteToken.allowance(sender, contractAddr);
      console.log("apprAmount:", apprAmount);

      const balanceBefore = await viteToken.balanceOf(sender);
      console.log('balanceBefore',balanceBefore);

      const viteAddr = "vite_098dfae02679a4ca05a4c8bf5dd00a8757f0c622bfccce7d68";
      const code = 545810;
      await erc2vite.bind(viteAddr, code, {from:sender});

      const balanceAfter = await getTokenBalanceAsync(sender);
      console.log('balanceAfter:', balanceAfter);
    });

    it('watch event', async () => {
      const bindEvent = await erc2vite.Bind();
      // console.log('bind event', bindEvent);
      bindEvent.watch(function(err, result){
        console.log('watch a event');
        if (!err)
          console.log(result);
          console.log(result['args']);
        });
    });

    it('get vite address', async () => {
      const viteAddr = await erc2vite.getViteAddr(sender, {from:sender});
      console.log('vite address', viteAddr);
    });

    it('call bind method again', async () => {
      await viteToken.transfer(sender, web3.toWei(200000), {from: owner});
      await viteToken.approve(contractAddr, web3.toWei(20), {from: sender});

      const apprAmount = await viteToken.allowance(sender, contractAddr);
      console.log("apprAmount:", apprAmount);

      const balanceBefore = await viteToken.balanceOf(sender);
      console.log('balanceBefore',balanceBefore);

      const viteAddr = "vite_098dfae02679a4ca05a4c8bf5dd00a8757f0c622bfccce7d69";
      await erc2vite.bind(viteAddr,0, {from:sender});

      const balanceAfter = await getTokenBalanceAsync(sender);
      console.log('balanceAfter:', balanceAfter);
    });

    it('get vite address again', async () => {
      const viteAddr = await erc2vite.getViteAddr(sender, {from:sender});
      console.log('vite address', viteAddr);
    });

    it('watch event again', async () => {
      const bindEvent = await erc2vite.Bind();
      // console.log('bind event', bindEvent);
      bindEvent.watch(function(err, result){
        console.log('watch a event');
        if (!err)
          console.log(result);
          console.log(result['args']);
        });
    });

    // it('owner should be able to destory program.', async () => {
    //   try {
    //     await erc2vite.destory({from: owner, gas: 500000});
    //     throw new Error('destoried by user, not owner');
    //     console.log('destory success');
    //   } catch (err) {
    //     assert(true, 'destoried by user should have thrown');
    //   }
    // });
  });
});

