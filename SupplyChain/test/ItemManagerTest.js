const { assert } = require("console");

const ItemManager = artifacts.require("./ItemManager.sol");
const TestFunnel = artifacts.require("./TestFunnel.sol");
const Item = artifacts.require("./Item.sol");

contract("Create , Pay for , Deliver Item Test", (accounts) => {
  it(" Should an Create Item with index 0,1 pay and deliver it ", async function () {
    const ItemManagerInstance = await ItemManager.deployed(); // is a PROMISE basically an analog of creating a web3.eth.contract()
    //TODO - CREATING ITEM
    const creatingItem1 = await ItemManagerInstance.createItem("jonas", 12, {
      from: accounts[0],
    });
    assert.equal(
      Delivery.logs[0].args._step.words[0],
      0,
      "Item Was Not Created"
    );
    //TODO pay for it
    const Item1Price = creatingItem1.logs[0].args._itemPrice.words[0];
    const ItemManagerAddress = await ItemManagerInstance.viewAddress();
    console.log(ItemManagerInstance);
    const Item1Index = creatingItem1.logs[0].args._itemIndex.words[0];

    const Item_1_ = await Item.new(ItemManagerAddress, Item1Price, 0, {
      from: accounts[0],
    });
    const Item1 = await Item.at(creatingItem1.logs[0].args.itemContractAddress);
    const res = await Item1.sendTransaction({
      from: accounts[0],
      value: 1200000,
      gas: 300000,
    });
    // console.log(res);
    assert.equal(
      Delivery.logs[0].args._step.words[0],
      1,
      "Item Was Not Paid For"
    );
    //TODO trgiggering dlivery
    const Delivery = await ItemManagerInstance.triggerDelivery(
      creatingItem1.logs[0].args._itemIndex.words[0]
    );
    // console.log(Delivery.logs[0].args._step.words[0]);
    assert.equal(
      Delivery.logs[0].args._step.words[0],
      2,
      "Item Was Not Delivered"
    );
  });
});
