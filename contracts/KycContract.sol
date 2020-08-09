// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KycContract is Ownable{
    mapping(address => bool) private kycComplited;

    event completed(address indexed _addr);
    //to make the address complete kyc and owner only can do it
    function setKyc(address _addr) public onlyOwner{
        require(!kycComplited[_addr], "Error: the address already complete Kyc");
        kycComplited[_addr] = true;
        emit completed(_addr);
    }
    //to delete the address from kyc list and make the address no longer completed the kyc
    function revokeKyc(address _addr) public onlyOwner{
        require(kycComplited[_addr], "Error : the address did't complete the kyc before");
        kycComplited[_addr] = false;
    }
    //return the address  status
    function isComplited(address _addr) public view returns(bool) {
        return kycComplited[_addr];
    }
}