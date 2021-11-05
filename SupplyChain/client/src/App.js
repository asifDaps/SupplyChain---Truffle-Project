import React, { Component } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";
class App extends Component {
  state = { loaded: false, cost: 0, itemCost: 0, itemName: "Example Item 1" };

  componentDidMount = async () => {
    try {
      // console.log(this.accounts[0]);

      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use this.web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.itemManager = new this.web3.eth.Contract(
        ItemManagerContract.abi,
        ItemManagerContract.networks[this.networkId] &&
          ItemManagerContract.networks[this.networkId].address
      );

      this.item = new this.web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[this.networkId] &&
          ItemContract.networks[this.networkId].address
      );

      // Set this.web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded: true });
      this.listenToPaymentEvent();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };
  handleSubmit = async () => {
    const { itemCost, itemName } = this.state;
    console.log(itemName, itemCost);

    const res = await this.itemManager.methods
      .createItem(itemName, itemCost)
      .send({ from: this.accounts[0] });
    alert(
      `Please Send ${res.events.SupplyChainStep.returnValues._itemPrice} Wei to address ${res.events.SupplyChainStep.returnValues.itemContractAddress}`
    );
  };

  listenToPaymentEvent() {
    this.itemManager.events.SupplyChainStep().on("data", async (event) => {
      console.log(event);
      const itemObj = this.itemManager.methods.items(event.returnValues); // Might need to change this to the this of the gobal socpe by using a variable outside callback
      console.log(itemObj);
      if (itemObj.arguments[0]._step === "1") {
        /// _step 0-> Creted , 1->Paid , 2 -> Delivered
        alert(
          `Item no.${itemObj.arguments[0]._itemIndex} has been paid for, deliver it now !`
        );
      }
    });
  }
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Event Trigger/SupplyChain Example</h1>
        <p>Add Items</p>
        Item Name :{" "}
        <input
          type="text"
          name="itemName"
          value={this.state.itemName}
          onChange={this.handleInputChange}
        />
        Item Cost :{" "}
        <input
          type="text"
          name="itemCost"
          value={this.state.itemCost}
          onChange={this.handleInputChange}
        />
        <button type="button" name="addItem" onClick={this.handleSubmit}>
          {" "}
          Add Item{" "}
        </button>
      </div>
    );
  }
}
//// DOESNT SHOW ANY FEEDBACK UPON ADDING ITEM
export default App;
