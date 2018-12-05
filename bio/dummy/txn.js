var Web3 = require('web3');
var module = require('./module.js');
var web3 = new Web3(new Web3.providers.HttpProvider(module.host));
//get the abi and the address from module.js file
var abi = module.HelloWorldABI;
var atContractAddr = module.HelloWorldAddress
console.log('At Contract Address: '+ atContractAddr)
var myContract = web3.eth.contract(abi);
// instantiate by address
var contractInstance = myContract.at(atContractAddr);
//Transaction #1
var txnObj = contractInstance.welcomeMssg('DEF',{gas: 500000,from:web3.eth.accounts[0]})
var receipt = JSON.parse(JSON.stringify(web3.eth.getTransactionReceipt(txnObj)))
// to fetch the address of the transactions and match with contract(to be done in future)
var txnLogAddress = receipt.logs[0]["address"]
console.log(txnLogAddress)
//Transaction #2
var txnObj2 = contractInstance.welcomeMssg('MNO',{gas: 500000,from:web3.eth.accounts[0]})
var receipt2 = JSON.parse(JSON.stringify(web3.eth.getTransactionReceipt(txnObj2)))
// to fetch the address of the transactions and match with contract(to be done in future)
var txnLogAddress2 = receipt2.logs[0]["address"]
console.log(txnLogAddress2)

//Transaction # 3
var txnObj3 = contractInstance.welcomeMssg('GGB',{gas: 500000,from:web3.eth.accounts[0]})
var receipt3 = JSON.parse(JSON.stringify(web3.eth.getTransactionReceipt(txnObj3)))
// to fetch the address of the transactions and match with contract(to be done in future)
var txnLogAddress3 = receipt3.logs[0]["address"]
console.log(txnLogAddress3)

//console.log(txnRcptObj)
//var txnLogAddress = JSON.stringify(txnRcptLogs.address)
//var contractAddress = txnRcptLogs.address
//console.log('Contract Address: '+ contractAddress)
//contractInstance.welcomeMssg('XYZ',{gas: 500000,from:web3.eth.accounts[1]})
//console.log(contractInstance.getMessage())