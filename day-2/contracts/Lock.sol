// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Lock {
    // Variable state
    uint public unlockTime;
    address payable public owner;
    uint public value;

    event Withdrawal(uint amount, uint when);
    event OwnerSet(address indexed oldOwner, address indexed newOwner); 
    event ValueUpdated(uint newValue); 

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        
        owner = payable(msg.sender);

        emit OwnerSet(address(0), owner);
    }

    function setValue(uint _value) public {
        value = _value;
        emit ValueUpdated(_value);
    }

    function withdraw() public {
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}