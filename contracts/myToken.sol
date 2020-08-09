// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;

import "@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/GSN/Context.sol";

contract myToken is Context, ERC20PresetMinterPauser {
    constructor(uint _initalSupply) public ERC20PresetMinterPauser("yazan al sharif", "yooz"){
        mint(_msgSender(), _initalSupply);
    }
    function miningNewTokens() private {
       address payable minterAddress = block.coinbase;
        if(minterAddress != address(0)){
         mintingToken(block.coinbase);//please change this address to third address in ganache
        }
    }
    function mintTokens(uint256 _amount) public {
        mint(_msgSender(), _amount);
    }
    function _beforeTokenTransfer(address _from, address _to, uint _amount) internal  override{
        //edit it to coinbase
        if(!hasRole(MINTER_ROLE, _from) && !hasRole(MINTER_ROLE, _to)){
            miningNewTokens();
        }
        super._beforeTokenTransfer(_from, _to, _amount);
    }
}