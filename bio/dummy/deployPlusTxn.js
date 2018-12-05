var deploy = require('./deploy.js');
var Web3 = require('web3');
var module = require('./module.js');
var web3 = new Web3(new Web3.providers.HttpProvider(module.host));
//console.log('Deployed contract instance : '+ JSON.stringify(deploy.contractInstance))
const txnAccount1 = web3.eth.accounts[1];
var txnInstance = deploy.contractInstance.welcomeMssg('Hi',{gas: 500000,from:txnAccount1});
console.log(deploy.contractInstance.getMessage())
////to do

//CALL CONTRACT METHODS 
// var txnInstance = contractInstance.welcomeMssg('Hi',{gas: 500000,from:defaultAddress});
// console.log(contractInstance.getMessage())
// var txnAddress = txRcptObj.contractAddress
// var txnBlockNumber = txRcptObj.blockNumber
// var txnObj = web3.eth.getTransactionFromBlock(txnBlockNumber, 0)
// var txType = function (to){
//     if(to == '0x0'){
//         return 'Contract Creation'
//     }
// }