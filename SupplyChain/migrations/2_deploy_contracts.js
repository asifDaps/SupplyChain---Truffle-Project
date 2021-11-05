var ItemManager = artifacts.require("./ItemManager.sol");
// var TestFunnel = artifacts.require("./TestFunnel.sol"); // Unsuccesful attempt to make a contract for forwarding payments
var Item = artifacts.require("./Item.sol");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(ItemManager);
  // deployer.deploy(TestFunnel);

  var itemPrice = 12; // default test price
  var itemIndex = 0; // default test price
  deployer.deploy(
    Item,
    "0xa98ec8757C9D9d56427158f7E6F6F34decE87958",
    itemPrice,
    itemIndex
  );
};
