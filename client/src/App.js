import React, { Component } from "react";
import myToken from "./contracts/myToken.json";
import myTokenSale from "./contracts/myTokenSale.json";
import kyc from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";
import Navbar from "./view/Navbar";
import Main from "./view/Main";
import "./App.css";

class App extends Component {
  state = {loaded:false,
          myAddress: null,
          KycAddress:"0x123....",
          balanceOfToken:0,
          addressContract: null,
          tokenContract:null,
          MinerAddress:"0x123....",
          adminRole:null,
          totalSupply:0,
          burnAmount:0
          };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      

      //get the myTokenContract instance
      this.myTokenInstance = await new this.web3.eth.Contract(
        myToken.abi,
        myToken.networks[this.networkId] && myToken.networks[this.networkId].address
      );
      //get the myTokenSale instance
      this.myTokenSaleInstance = await new this.web3.eth.Contract(
        myTokenSale.abi,
        myTokenSale.networks[this.networkId] && myTokenSale.networks[this.networkId].address
      )
     
      //get the KycContrac instance 
      this.kycInstance = await new this.web3.eth.Contract(
        kyc.abi,
        kyc.networks[this.networkId] && kyc.networks[this.networkId].address
      );
      this.BN = this.web3.utils.BN;
      this.onChangeAccountHandle();
    //  this.listenToKycEvents();
      this.listenToAmountOfToken();
      this.getTheAdminOfContracts();
      this.listenToTotalSupply();
      
      this.setState({
        loaded:true,
        myAddress:this.accounts[0].toLowerCase(), 
        addressContract:myTokenSale.networks[this.networkId].address,
        tokenContract:myToken.networks[this.networkId].address},
        this.updateToken,
        );
        
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  getTheAdminOfContracts = async () => {
     //get secret from contract 
     let secret = await this.myTokenInstance.methods.MINTER_ROLE().call();
     //get the admin of contracts 
     let adminRole = await this.myTokenInstance.methods.getRoleAdmin(secret).call();
     let adminAddress = await this.myTokenInstance.methods.getRoleMember(adminRole, 0).call();
     this.setState({adminRole:adminAddress.toLowerCase()});
  }
  onChangeAccountHandle = async () => {
     await window.ethereum.on("accountsChanged", async address => {
      this.setState({myAddress:address[0].toLowerCase()});
      this.updateToken();
    });
    
  }
  handleInputChange = (event) => {
    let target = event.target;
    let value = target === "checkbox"? target.checkbox : target.value;
    let name = target.name;
    this.setState({
      [name] : value
    })
  }
  handleKyc = async () => {
   const kycComplited = await this.kycInstance.methods.setKyc(this.state.KycAddress).send({from:this.state.myAddress,handleRevert:true}).on("error", (error) => {
     console.error("the error is", error);
   });
   alert("the address \t " + kycComplited.events.completed.returnValues._addr + " \t completed KYC");
  }

  listenToAmountOfToken = () => {
    this.myTokenInstance.events.Transfer({to:this.myAddress}).on("data", this.updateToken);
  }

  updateToken = async () => {
    let balance = await this.myTokenInstance.methods.balanceOf(this.state.myAddress).call();
    let displayBalance = balance / Math.pow(10, 18);
    this.setState({balanceOfToken: displayBalance.toFixed(18)});
  }

  handleMiners = async () => {
    const {MinerAddress, myAddress} = this.state;
    let minerSecret = await this.myTokenInstance.methods.MINTER_ROLE().call();
    let addMiner = await this.myTokenInstance.methods.grantRole(minerSecret, MinerAddress).send({from:myAddress});
    let event = addMiner.events.RoleGranted.returnValues;
    alert("the address \t " + event.account + "is miner now from " + "  " + event.sender + "   ");
  }
  handlePauseTransactions = async () => {
    await this.myTokenInstance.methods.pause().send({from:this.state.myAddress});
    console.log("no one can send transaction now");
  }
  handleUnpauseTranactions = async () => {
    await this.myTokenInstance.methods.unpause().send({from:this.state.myAddress});
    console.log("transaction return normal");
  }
  handleBurnToken = async () => {
    let {myAddress, burnAmount} = this.state;
    burnAmount = burnAmount * Math.pow(10, 18);
    const burnTokens = burnAmount.toString();
    const burn = await this.myTokenInstance.methods.burn(burnTokens).send({from:myAddress});
    const event = burn.events.Transfer.returnValues;
    alert("from account "+ event.from +"to account "+ event.to + "event value" + event.value / Math.pow(10,18));
    this.listenToTotalSupply();
  }
  listenToTotalSupply = async () => {
    const toSupply = await this.myTokenInstance.methods.totalSupply().call();
    const displayTotalSupply = toSupply / Math.pow(10, 18);
    console.log(toSupply);
    this.setState({totalSupply:displayTotalSupply});
  }
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Navbar 
        address={this.state.myAddress}
        balanceOfToken = {this.state.balanceOfToken}
        totalSupply = {this.state.totalSupply}
        />
        <Main 
        kycAddress={this.state.KycAddress}
        handleInputChange={this.handleInputChange}
        handleKyc = {this.handleKyc}
        addressContract = {this.state.addressContract}
        tokenContract = {this.state.tokenContract}
        handleMiners = {this.handleMiners}
        minerAddress = {this.state.MinerAddress}
        adminAddress = {this.state.adminRole}
        myAddress={this.state.myAddress}
        pause = {this.handlePauseTransactions}
        unpause = {this.handleUnpauseTranactions}
        handleBurnToken = {this.handleBurnToken}
        burnAmount = {this.state.burnAmount}
        />
      </div>
    );
  }
}

export default App;
