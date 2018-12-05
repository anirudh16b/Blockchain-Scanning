//Instantiate web3 and make sure we can see our accounts;
var Web3 = require('web3'); //need web3 1.0
var fs = require('fs');
var module = require('./module.js')
var web3 = new Web3(new Web3.providers.HttpProvider(module.host));
var accounts; // show all our available accounts
//Compile contracts with solc, the solidity compiler
var solc = require('solc');
var contractSrc = fs.readFileSync('./HelloWorld.sol', 'utf8');
var contractCom = solc.compile(contractSrc);
//Create contract object
var abi = JSON.parse(contractCom.contracts[':HelloWorld'].interface);
var bytecode = contractCom.contracts[':HelloWorld'].bytecode;
var gasEstimate = web3.eth.estimateGas({ data: bytecode });
//Build transaction object;
var argHex = web3.toHex("Hello"); //Needed because our contract constructor needs a bytes32 type
const defaultAddress = web3.eth.accounts[0];
// Deploy contract syncronous: The address will be added as soon as the contract is mined.
// Additionally you can watch the transaction by using the "transactionHash" property
var HelloWorld = web3.eth.contract(abi, { from: defaultAddress });
var HelloWorldReturned = HelloWorld.new('Hello', { data: bytecode, gas: 1000000, from: defaultAddress });
var txHash = HelloWorldReturned.transactionHash;
var txnReceipt = web3.eth.getTransactionReceipt(txHash)
var txRcptObj = JSON.parse(JSON.stringify(txnReceipt))
var receipt = web3.eth.getTransactionReceipt(txHash);
var rcptObj = JSON.parse(JSON.stringify(receipt))
var contractAddress = rcptObj.contractAddress
var transaction = web3.eth.getTransaction(txHash);
var txObj = JSON.parse(JSON.stringify(transaction))
var to = txObj.to
var contractInstance = HelloWorld.at(contractAddress)
var contractEvent = contractInstance.allEvents({ toBlock: 'latest' })
var eventLogObj = contractEvent.get(function (err, logs) {
    if (!err) {
        return JSON.stringify(logs)
    }
})
//console.log('Event Log: '+ JSON.stringify(eventLogObj))
console.log('Contract Address: ' + contractAddress)
//EXPORTS
module.exports = {
    abi,
    defaultAddress,
    contractAddress,
    txHash,
    receipt,
    rcptObj,
    transaction,
    txObj,
    contractInstance,
    contractEvent,
    eventLogObj
}