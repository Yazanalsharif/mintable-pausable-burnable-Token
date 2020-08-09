const path = require("path");
const hdWalletProvider = require("@truffle/hdwallet-provider");
const accountIndex = 0;
require("dotenv").config({path:"./token.env"});

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777" // Match any network id
    },
    ganache_local:{
      provider:function () {
        return new hdWalletProvider(process.env.MNOMNIC, "http://127.0.0.1:7545", accountIndex);
      },
      network_id:"5777"
    },
    goerli_infura: {
      provider: function() {
        return new HDWalletProvider(process.env.MNOMINIC, "https://goerli.infura.io/v3/83f7879b6c5d4faab20f7dc1d221af1c", accountIndex);
      },
      network_id:"5"
    }
  },
  compilers:{
    solc:{
      version:"0.6.4"
    }
  }
};
//web3.eth.sendTransaction({from:"0x563E96866145652601Fe24fACF0368E3ddD4CE4d", to:"0x3d5eA0305dc7ed9F8557C85B64aB63A181F1f9cA", value:web3.utils.toWei("10","ether")});
