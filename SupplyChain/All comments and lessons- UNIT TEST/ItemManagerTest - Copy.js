const ItemManager = artifacts.require("./ItemManager.sol");
const TestFunnel = artifacts.require("./TestFunnel.sol");
const Item = artifacts.require("./Item.sol");

contract("Create , Pay for , Deliver Item Test", (accounts) => {
  it(" Should an Create Item with index 0,1 pay and deliver it ", async function () {
    const ItemManagerContractInstance = await ItemManager.deployed(); // is a PROMISE basically an analog of creating a web3.eth.contract()
    //TODO - CREATING ITEM
    const creatingItem1 = await ItemManagerContractInstance.createItem(
      "Balalaika",
      12,
      {
        // calling the createItem Method of contract
        from: accounts[0], ///////        from acc 0
      }
    );
    // console.log();

    // const creatingItem2 = await ItemManagerContractInstance.createItem(
    //   "Jamal",
    //   24,
    //   {
    //     from: accounts[1],
    //   }
    // );
    // assert.equal(
    //   creatingItem2.logs[0].args._itemIndex.words[0],
    //   1,
    //   "item isnt the second one created"
    // );

    // verify its the first item using assert statemnt
    // assert.equal()

    //TODO pay for it
    //NOTE -  Approach 3 creating a PayFunnel Function (or even create a contrat too if there be a lot of such function required)
    // const Item1Address = creatingItem1.logs[0].args.itemContractAddress;
    // console.log(Item1Address);
    // const PayTest = await TestFunnel.deployed();        tried to make separate test funels contract had problems
    const Item1Price = creatingItem1.logs[0].args._itemPrice.words[0];
    const ItemManagerAddress = await ItemManagerContractInstance.viewAddress();
    const Item1Index = creatingItem1.logs[0].args._itemIndex.words[0];
    // const paying =
    //   await ItemManagerContractInstance.UnitTestPayFunnelForFirstItem({
    //     from: accounts[0],
    //     value: Item1Price,
    //   });
    // console.log(paying.logs[0].args.itemContractAddress);
    // assert.equal(
    //   paying.logs[0].args._step.words[0],
    //   1,
    //   "Item Was Not Paid For"
    // );

    // NOTE - approach 1
    // tried creating a contract abstraction of item but kept geting the follwing error
    // Error: Item has not been deployed to detected network (network/artifact mismatch)
    //       at Object.checkNetworkArtifactMatch (C:\Users\Asus\AppData\Roaming\npm\node_modules\truffle\build\webpack:\packages\contract\lib\utils\index.js:247:1)
    //       at Function.deployed (C:\Users\Asus\AppData\Roaming\npm\node_modules\truffle\build\webpack:\packages\contract\lib\contract\constructorMethods.js:83:1)
    //       at processTicksAndRejections (internal/process/task_queues.js:97:5)
    //       at Context.<anonymous> (test\ItemManagerTest.js:35:19)

    const Item_1_ = await Item.new(ItemManagerAddress, Item1Price, 0, {
      from: accounts[0],
    });
    const Item1 = await Item.at(creatingItem1.logs[0].args.itemContractAddress);
    const res = await Item1.sendTransaction({
      from: accounts[0],
      value: 1200000,
      gas: 300000,
    });
    // console.log(creatingItem1.logs[0].args.itemContractAddress);
    console.log(res.receipt.rawLogs[0]);

    // tried deploying item contract to netwrok doesnt work

    // NOTE APproach 2
    // will try geting the item cotract from items mapping
    // const item1 = await ItemManagerContractInstance.items(0);
    // const res = await item1.send(item1._itemPrice.words[0]);
    // Got an object back from items ( but it was not a isntance of contract abstraction most likely)

    // trigger deilvery item1._itemPrice.words[0]            ItemManagerContractInstance._address
    // console.log(ItemManagerContractInstance.source);
    // console.log(item1);

    //TODO trgiggering dlivery
    const Delivery = await ItemManagerContractInstance.triggerDelivery(
      creatingItem1.logs[0].args._itemIndex.words[0]
    );
    // console.log(await ItemManagerContractInstance.items(0));
    // assert.equal(
    //   Delivery.logs[0].args._step.words[0],
    //   2,
    //   "Item Was Not Delivered"
    // );
    console.log(Delivery.logs[0].args._step.words[0]);
  });
});
