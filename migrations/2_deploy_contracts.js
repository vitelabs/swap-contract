var ViteToken   = artifacts.require("./ViteToken.sol")
var Erc2Vite  = artifacts.require("./Erc2Vite.sol")

module.exports = function(deployer, network, accounts) {
  console.log("network: " + network);
  console.log(accounts)

  if (network == "live") {

  } else {
    deployer.deploy(ViteToken)
    .then(function() {
      return deployer.deploy(
        Erc2Vite,
        ViteToken.address,
        accounts[0]);
    });
  }
};