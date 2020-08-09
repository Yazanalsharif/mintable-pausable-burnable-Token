const myToken = artifacts.require("./myToken.sol");

const BN = web3.utils.BN;

const chai = require("./setupChai");

const expect = chai.expect;

require("dotenv").config({path:"../token.env"});

beforeEach(async () => {
    this.myToken = await myToken.new(new BN(process.env.TOTAL_SUPPLY));
})
contract("test myToken Contract", async accounts => {
 [deployer , recipient, miner, rec] = accounts;
 it("test totalSupply", async () => {
     let instance = this.myToken;
     let totalSupply = await instance.totalSupply();
     return expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(new BN(totalSupply));
 });
 //test that only admin role can add miners to the tokens
 /*it("you can send Token from account 1 to account 2 with mint new Tokens", async () => {
     let instance = this.myToken;
     let totalSupply = await instance.totalSupply();
     let tokens = new BN(30);
     let balanceOfTokensInDeployer = await instance.balanceOf(deployer);
     expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(totalSupply);
      //get hashing of miner role to add miner
      let secret = await instance.MINTER_ROLE();
      //add the coinbase address to miners list
     expect(instance.grantRole(secret, miner)).to.eventually.be.fulfilled;
     //only adminRole can add miners
     expect(instance.grantRole(secret, recipient, {from:miner})).to.eventually.be.rejected;
     //after this transaction will not mint new tokens becouse the miner start the transaction
     expect(instance.transfer(recipient, tokens)).to.eventually.be.fulfilled;
     //the amount will not minted here
     //to make sure that transaction is done and sender shortage 30 tokens
     expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(balanceOfTokensInDeployer.sub(tokens));
     //to make sure that no tokens minted
     expect(await instance.balanceOf(miner)).to.be.bignumber.equal(new BN(0));
     //to make sure that recipient recive 30 tokens
     expect(await instance.balanceOf(recipient)).to.be.bignumber.equal(tokens);
     //send transaction from recipient (not miner) to make sure new tokens minted
     expect(instance.transfer(deployer, tokens, {from:recipient})).to.eventually.be.fulfilled;
     //no token will mining here becouse the transaction from account to miner  
     expect(await instance.balanceOf(miner)).to.be.bignumber.equal(new BN(0));
     let mintedAmount = new BN(process.env.MINER);
     //send token to recepiant account and ofcourse no token will mint becouse transaction from miner
     expect(instance.transfer(recipient, tokens)).to.eventually.be.fulfilled;
     //must token minted here to coinbase
     expect(instance.transfer(rec, new BN(tokens), {from:recipient})).to.eventually.be.fulfilled;
     return expect(await instance.balanceOf(miner)).to.be.bignumber.equal(mintedAmount);
     //console.log("the total Supply ", totalSupply);
     //console.log("balanceOf deployer ",await instance.balanceOf(deployer));
     //console.log("balanceOfrecepien t  " ,await instance.balanceOf(recipient));
     //console.log("balanceOfminer " ,await instance.balanceOf(miner));
 });*/

 it("send token without any mining becouse there is no coinBase address", async() => {
     let instance = this.myToken;     
     let balanceOfDeployer = await instance.balanceOf(deployer);
     let totalSupply = await instance.totalSupply();
     let oneToken = new BN(1);
     expect(balanceOfDeployer).to.be.bignumber.equal(totalSupply);
     expect(instance.transfer(recipient, oneToken, {from:deployer})).to.eventually.be.fulfilled;
     expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(balanceOfDeployer.sub(oneToken));
     expect(await instance.balanceOf(recipient)).to.be.bignumber.equal(oneToken);
     let newTotalSupply = await instance.totalSupply();//to test that no miner happened
     return expect(totalSupply).to.be.bignumber.equal(newTotalSupply);//still the same 
 });

 it("the miners can't minig to themself", async () => {
     let instance = this.myToken;
     let totalSupply = await instance.totalSupply();
     expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(totalSupply);
     let tokens = new BN(1);
     expect(instance.transfer(recipient, tokens)).to.eventually.be.fulfilled;
     let totalSupplyAfterTran = await instance.totalSupply();
     return expect(totalSupply).to.be.bignumber.equal(totalSupplyAfterTran);
 });

 it("you can't send token more than you have ", async () => {
     let instance = this.myToken;
     let totalSupply = await instance.totalSupply();
     //test that msg.sender receive all tokens
     expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(totalSupply);
     expect(instance.transfer(recipient, totalSupply.add(new BN(10)))).to.eventually.be.rejected;
     expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(totalSupply);
     return expect(await instance.balanceOf(recipient)).to.be.bignumber.equal(new BN(0));
 });
 it("you can't pause the transaction without pauseRole", async () => {
     let instance = this.myToken;
     let tokens = new BN(30);
     let totalSupply = await instance.totalSupply();
     expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(totalSupply);
     expect(instance.pause({from:recipient})).to.eventually.be.rejected;
     expect(instance.transfer(recipient, tokens)).to.eventually.be.fulfilled;
     return expect(await instance.balanceOf(recipient)).to.be.bignumber.equal(tokens);
 });
 it("only pauseRole can pause all transactions on the network", async ()=> {
    let instance = this.myToken;
    let tokens = new BN(30);
    let totalSupply = await instance.totalSupply();
    expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(totalSupply);
    expect(instance.pause({from:deployer})).to.eventually.be.fulfilled;
    expect(instance.transfer(recipient, tokens)).to.eventually.be.rejected;
    return expect(await instance.balanceOf(recipient)).to.be.bignumber.equal(new BN(0));
 });
 it("pause and unpuse test", async () => {
    let instance = this.myToken;
    let tokens = new BN(30);
    let totalSupply = await instance.totalSupply();
    expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(totalSupply);
    expect(instance.pause({from:deployer})).to.eventually.be.fulfilled;
    expect(instance.transfer(recipient, tokens)).to.eventually.be.rejected;
    expect(await instance.balanceOf(recipient)).to.be.bignumber.equal(new BN(0));
    //rejected because not the owner called the function
    expect(instance.unpause({from:recipient})).to.eventually.be.rejected;
    expect(instance.transfer(recipient, tokens)).to.eventually.be.rejected;
    expect(await instance.balanceOf(recipient)).to.be.bignumber.equal(new BN(0));
    //call by owner 
    expect(instance.unpause({from:deployer})).to.eventually.be.fulfilled;
    expect(instance.transfer(recipient, tokens)).to.eventually.be.fulfilled;
    return expect(await instance.balanceOf(recipient)).to.be.bignumber.equal(new BN(tokens));
 });
 it("you can't send transactionFrom without approval", async () => {
     let instance = this.myToken;
     let totalSupply = await instance.totalSupply();
     expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(totalSupply);
     expect(instance.approve(recipient, totalSupply, {from:deployer})).to.eventually.be.fulfilled;
     expect(instance.transferFrom(deployer, recipient, totalSupply, {from:recipient})).to.eventually.be.fulfilled;
     expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(new BN(0));
     return expect(await instance.balanceOf(recipient)).to.be.bignumber.equal(totalSupply);
 });
 it("who has token can burn it", async() => {
     let instance = this.myToken;
     let totalSupply = await instance.totalSupply();
     expect(instance.burn(totalSupply)).to.eventually.be.fulfilled;
     totalSupply = await instance.totalSupply();
     expect(totalSupply).to.be.bignumber.equal(new BN(0));
     console.log(totalSupply);
 })
 it("approve token to your friend and your friend can burn it", async() => {
    let instance = this.myToken;
    let totalSupply = await instance.totalSupply();
    expect(instance.approve(recipient,totalSupply)).to.eventually.be.fulfilled;
    expect(instance.burnFrom(deployer, totalSupply, {from:recipient})).to.eventually.be.fulfilled;
    return expect(await instance.totalSupply()).to.be.bignumber.equal(new BN(0));
});
})