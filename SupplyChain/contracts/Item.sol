// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; 

import "./ItemManager.sol";
contract Item{
    uint public _itemPrice ; 
    uint public _itemIndex; 
    bool public _paymentDone ; 

    ItemManager public _parentContract ; 
    
    constructor(ItemManager initiatingContract, uint _price,uint _index)  {
        _itemIndex = _index; 
        _itemPrice = _price ; 
        _parentContract = initiatingContract ; 
    }

    // TODO -unit test functionality - if client pays extra ,sed the remaingn back toclient
    receive() external payable {
        require(_itemPrice <= msg.value, "Insufficient Amount of Wei Sent"); 
        if(msg.value>_itemPrice){
            uint extra = msg.value-_itemPrice ; 
            payable(msg.sender).transfer(extra) ; //might need to send a bit less?? to have some gass left? ADD FUNCTION FOR GAS 
        }
         require(!_paymentDone,"Item is already paid for");
         _paymentDone = true; 
        
        (bool status , ) = 
            address(_parentContract)
            .call{value:_itemPrice,gas:3000000}                //// Might need to change thsi value a litle 
            (abi.encodeWithSignature("triggerPayment(uint256)",_itemIndex));
        
        require(status, "Payment Unsuccesful Reverting TRXN") ; 
        
    }
   
}
