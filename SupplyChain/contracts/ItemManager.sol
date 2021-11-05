// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; 

import "@openzeppelin/contracts/access/Ownable.sol" ; 
import "./Item.sol" ; 



contract Authorize is Ownable{
    mapping(address => bool) public isCreator ; 
    mapping(address => bool) public isDelivery;
    event NewCreatorAssigned(address indexed _byWhom,address indexed _newCreatorAssigned);  
    event NewDeliveryAssigned(address indexed _byWhom,address indexed _newDeliveryAssigned);  
    
    function setCreator(address _creatorAddress) public onlyOwner{
        isCreator[_creatorAddress] = true ;
        emit NewCreatorAssigned(msg.sender, _creatorAddress);
    }
    
    function setDeliverer(address _delivererAddress) public onlyOwner{
        isDelivery[_delivererAddress] = true ; 
        emit NewDeliveryAssigned(msg.sender, _delivererAddress);
    }
    
    modifier onlyCreator ()  {
        require(isCreator[msg.sender],"You Are Not Allowed to Create Items");
        _;
    }
    modifier onlyDelivery ()  {
        require(isDelivery[msg.sender],"You Are Not Allowed to Deliver Items");
        _;
    }
    
}

contract ItemManager is Authorize{
    
    enum SupplyChainState{Created,Paid,Delivered} 
    struct S_Item{
        string  _identifier ; 
        uint _itemPrice ; 
        ItemManager.SupplyChainState _state ; 
        Item item ; 
    }
    mapping (uint => S_Item) public items ; 
    uint index;
    
    event SupplyChainStep(uint _itemIndex,uint _itemPrice, uint _step, address itemContractAddress );
    
    function viewAddress() external view returns(address){
        return address(this);
    }
    function createItem(string memory _identifier,uint _itemPrice) public { // Only Creator Modifier onlyCreator
     //   /has to emit item creaton event somewhere
        Item newItem = new Item(this,_itemPrice,index);
        items[index]._identifier = _identifier ; 
        items[index].item =  newItem ; 
        items[index]._itemPrice = _itemPrice ; 
        items[index]._state = SupplyChainState.Created ; 
        emit SupplyChainStep( index ,items[index]._itemPrice, uint(items[index]._state) , address(items[index].item) );
        index++;
    }
    
    function triggerPayment(uint _index)  public payable {
        require(items[_index]._itemPrice == msg.value , "Full Payments Only");
        require(items[_index]._state == SupplyChainState.Created , "Item is further along the supply chain");
        items[_index]._state = SupplyChainState.Paid ; 
        
        emit SupplyChainStep(_index,items[index]._itemPrice,uint(items[_index]._state), address(items[index].item)); 
    }
    


    function seeProgress(uint _index) view external returns (uint){
        return uint(items[_index]._state);
    }
  
    function triggerDelivery(uint _index) public  { //ONLY DELIVERY MAN MODIFIER onlyDelivery
       require(items[_index]._state == SupplyChainState.Paid , "Item is either not paid for or further along the supply chain");
       items[_index]._state = SupplyChainState.Delivered  ; 
       emit SupplyChainStep(_index,items[index]._itemPrice,uint(items[_index]._state), address(items[index].item)); 
    }

function UnitTestPayFunnelForFirstItem() public payable{
    //    address itemAddress = address(items[0].item) ; 
    //     (bool success , ) = payable(itemAddress)
    //     .call{value:msg.value,gas:3000000}("");                //// Might need to change thsi value a litle 
    //     require(success,"TRXN was UNSSUCCESFULL");
        (bool success , ) = payable(items[0].item)
        .call{value:msg.value,gas:3000000}("");                //// Might need to change thsi value a litle 
        require(success,"TRXN was UNSSUCCESFULL");
            //    emit SupplyChainStep(0,items[0]._itemPrice,uint(items[0]._state), address(items[0].item)); 

    }

    

}

contract TestFunnel is ItemManager{
    receive() external payable {
        // require(_itemPrice <= msg.value, "Insufficient Amount of Wei Sent"); 
        // if(msg.value>_itemPrice){
        //     uint extra = msg.value-_itemPrice ; 
        //     payable(msg.sender).transfer(extra) ; //might need to send a bit less?? to have some gass left? ADD FUNCTION FOR GAS 
        // }
        //  require(!_paymentDone,"Item is already paid for");
        //  _paymentDone = true; 
        
        // (bool status , ) = 
        //     address(_parentContract)
        //     .call{value:_itemPrice,gas:3000000}                //// Might need to change thsi value a litle 
        //     (abi.encodeWithSignature("triggerPayment(uint256)",_itemIndex));
        
        // require(status, "Payment Unsuccesful Reverting TRXN") ; 
        
    }
    
// comment out the function below later     
    // function UnitTestPayFunnelForFirstItem() public payable{
    // //    address itemAddress = address(items[0].item) ; 
    // //     (bool success , ) = payable(itemAddress)
    // //     .call{value:msg.value,gas:3000000}("");                //// Might need to change thsi value a litle 
    // //     require(success,"TRXN was UNSSUCCESFULL");
    //     (bool success , ) = payable(items[0].item)
    //     .call{value:msg.value,gas:3000000}("");                //// Might need to change thsi value a litle 
    //     require(success,"TRXN was UNSSUCCESFULL");
    //         //    emit SupplyChainStep(0,items[0]._itemPrice,uint(items[0]._state), address(items[0].item)); 

    // }

}