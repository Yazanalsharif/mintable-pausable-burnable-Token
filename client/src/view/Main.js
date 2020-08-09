import React , {Component} from "react";
import "../App.css";

class Main extends Component{
render() {
    return(
      <div className="main-style">
       { this.props.myAddress === this.props.adminAddress ?
         <div className="behind">
         <div className="kyc-style">
            <h1>complete KYC Please </h1>
           <div className="form-group">
             <label htmlFor="exampleInputEmail1">the address</label>
             <input type="text" className="form-control" 
             aria-describedby="emailHelp"
             name="KycAddress" 
             value={this.props.kycAddress}
             onChange={this.props.handleInputChange}
             />
             <small id="emailHelp" className="form-text text-muted">only owner can complete your kyc</small>
           </div>
           <button type="submit" className="btn btn-primary" onClick={this.props.handleKyc}>completeKyc</button>
           </div>
           <div className="add-miners">
             <h1>add miners from admin Role</h1>
                <div className="form-group">
               <label htmlFor="exampleInputEmail1">the address</label>
               <input type="text"
                className="form-control" 
                id="exampleInputEmail1" 
                aria-describedby="emailHelp" 
                name="MinerAddress"
                value={this.props.minerAddress}
                onChange={this.props.handleInputChange}
                />
               <small id="emailHelp" className="form-text text-muted">only admin can add miners</small>
             </div>
             <button type="submit" className="btn btn-primary" onClick={this.props.handleMiners}>add miners</button>
         </div>
         </div>
         :
         <p></p>
       }
       <div className="behind">
       <div className="burn-style">
            <h1>burn tokens</h1>
           <div className="form-group">
             <label htmlFor="exampleInputEmail1">token amount: </label>
             <input type="text" className="form-control" 
             aria-describedby="emailHelp"
             name="burnAmount"
             value={this.props.burnAmount}
             onChange={this.props.handleInputChange}
             />
             <small id="emailHelp" className="form-text text-muted">you can burn your tokens here</small>
           </div>
           <button type="submit" className="btn btn-primary" onClick={this.props.handleBurnToken}>burn</button>
           </div>
           <div className="pause-style">
            <h1>pause & unpause transaction</h1>
           <div className="form-group">
             
             <small id="emailHelp" className="form-text text-muted">only owner can pause transactions</small>
           </div>
           <button type="submit" className="btn btn-primary mar" onClick={this.props.pause}> pause </button>
           <button type="submit" className="btn btn-primary" onClick={this.props.unpause}> unpause </button>
           </div>

       </div>
      
       
        <div className="purshase">
          <h1>purshase (yooz token)</h1>
          <p className="text-center">purshase token by send ether to this address</p>
          <p className="font-weight-normal text-center">tokenSale contract: {this.props.addressContract}</p>
          <p className="font-weight-normal text-center">token contract: {this.props.tokenContract}</p>
        </div>
          
          
    </div>
    )
}
}
export default Main; 