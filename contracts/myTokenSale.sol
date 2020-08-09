// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;

import "./Crowdsale.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./KycContract.sol";

contract myTokenSale is Crowdsale {
    KycContract kyc;
    constructor(uint rate, address payable wallet, IERC20 token, KycContract _kyc) Crowdsale (rate, wallet, token) public {
        kyc = _kyc;
    }
    function _preValidatePurchase(address _beneficiary, uint256 weiAmount) internal view  override {
        super._preValidatePurchase(_beneficiary, weiAmount);
        uint256 balanceAllowed = 0.5 ether;
        require(kyc.isComplited(_beneficiary), "error: you did't complete the kyc");
         if(weiAmount < balanceAllowed) {
            revert("value must be equal or greater than 0.5 ethereum");
        }else {
            //nothing to do
        }

    }

}