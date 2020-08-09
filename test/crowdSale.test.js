const myToken = artifacts.require("myToken");
const myTokenSale = artifacts.require("./myTokenSale.sol");
const Kyc = artifacts.require("./KycContract.sol");
const chai = require("./setupChai");

require("dotenv").config({path:"../token.env"});

const BN = web3.utils.BN;

const expect = chai.expect;

contract("test CrowdSale contract", async accounts => {
    let [deployer, recepiant, third] = accounts;
    it("all tokens must in crowdSale and no tokens in the accounts", async () => {
        let instance = await myToken.deployed();
        let totalSupply = await instance.totalSupply();
        //the deployer must has no tokens
        expect(await instance.balanceOf(deployer)).to.be.bignumber.equal(new BN(0));
        expect(await instance.balanceOf(myTokenSale.address)).to.be.bignumber.equal(new BN(totalSupply));
    });
    it("you can't purchase tokens without kyc", async() => {
        let myTokenInstance = await myToken.deployed();
        let myTokenSaleInstance = await myTokenSale.deployed();
        let totalSupply = await myTokenInstance.totalSupply();
        //all tokens in myTokenSale contract
        expect(await myTokenInstance.balanceOf(myTokenSaleInstance.address)).to.be.bignumber.equal(totalSupply);
        //sendTransaction to myTokenSale will rejected becouse you did't complete the kyc 
        expect(myTokenInstance.sendTransaction({from:deployer, value:web3.utils.toWei("1", "ether")})).to.eventually.be.rejected;
        expect(await myTokenInstance.balanceOf(deployer)).to.be.bignumber.equal(new BN(0));
    });
    it("only owner can complete your Kyc", async () => {
        let KycInstance = await Kyc.deployed();
        //recepiant is not the owner so it will rejected this transaction
        expect(KycInstance.setKyc(third, {from:recepiant})).to.eventually.be.rejected;
        //third address did't complete Kyc
        expect(await KycInstance.isComplited(third)).to.be.equal(false);
        expect(KycInstance.setKyc(third)).to.eventually.be.fulfilled;
        const com =  await KycInstance.isComplited(third);  
        expect(com).to.be.equal(true);
    });
    it("you can't purshase token less than 0.5 ethereum", async () => {
        let myTokenInstance = await myToken.deployed();
        let myTokenSaleInstance = await myTokenSale.deployed();
        expect(myTokenSaleInstance.sendTransaction({from:third, value:web3.utils.toWei("0.4", "ether")})).to.eventually.be.rejected;
        expect(await myTokenInstance.balanceOf(third)).to.be.bignumber.equal(new BN(0));

    })
    it("you can purshase token if you are completed Kyc and the amount biger than 0.5 ether", async () => {
        let KycInstance = await Kyc.deployed();
        let myTokenInstance = await myToken.deployed();
        let myTokenSaleInstance = await myTokenSale.deployed();
        expect(myTokenSaleInstance.sendTransaction({from:third, value:web3.utils.toWei("1", "ether")})).to.eventually.be.fulfilled;
        expect(await myTokenInstance.balanceOf(third)).to.be.bignumber.equal(await myTokenInstance.balanceOf(third));
        expect(KycInstance.setKyc(third)).to.eventually.be.fulfilled;
        expect(myTokenSaleInstance.sendTransaction({from:third, value:web3.utils.toWei("1", "ether")})).to.eventually.be.fulfilled;
        expect(myTokenSaleInstance.sendTransaction({from:third, value:web3.utils.toWei("1", "ether")})).to.eventually.be.fulfilled;
        expect(myTokenSaleInstance.sendTransaction({from:third, value:web3.utils.toWei("1", "ether")})).to.eventually.be.fulfilled;
        expect(myTokenSaleInstance.sendTransaction({from:third, value:web3.utils.toWei("1", "ether")})).to.eventually.be.fulfilled;
        expect(myTokenSaleInstance.sendTransaction({from:third, value:web3.utils.toWei("1", "ether")})).to.eventually.be.fulfilled;
    });
    
})