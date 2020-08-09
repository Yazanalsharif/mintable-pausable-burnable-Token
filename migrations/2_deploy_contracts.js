const myToken = artifacts.require("./myToken.sol");
const KycContract = artifacts.require("./KycContract.sol");
const MyTokenSaleContract = artifacts.require("./myTokenSale.sol");

require("dotenv").config({path:"../token.env"});


module.exports = async function(deployer)  {
  //use big number 
  const BN = web3.utils.BN;
  //get accounts from the blockchain network
  const accounts = await web3.eth.getAccounts();
  //deploy erc20 minable token 
  await deployer.deploy(myToken, process.env.TOTAL_SUPPLY);
  //deploy KycContract so i can use it
  await deployer.deploy(KycContract);
  //deploy myTokenSale contract with rate(token price), wallet which receive ethereum, the token contract, kycContract (must be complited to buy tokens)
  await deployer.deploy(MyTokenSaleContract, new BN(1), accounts[0], myToken.address, KycContract.address);
  //deploy minable token on blockchain network 
  const instance = await myToken.deployed();
  //send all tokens to crowedSale contract that can sell it by ICO website 
  await instance.transfer(MyTokenSaleContract.address, process.env.TOTAL_SUPPLY);
}