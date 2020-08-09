import React , {Component} from "react";
import "../App.css";

class Navbar extends Component{
    render(){
        return(
            <div>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <a className="navbar-brand" href="https://twitter.com/YazanAlsharif12">Yazan al sharif</a>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
   
    </ul>
      <p className="text-right text-edit">totalSupply:{this.props.totalSupply} Your address: {this.props.address} yourAmount: {this.props.balanceOfToken}</p>
  </div>
</nav>
</div>
          
        )
    }
}
export default Navbar;