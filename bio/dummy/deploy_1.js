//Instantiate web3 and make sure we can see our accounts;
var Web3 = require('web3'); //need web3 1.0
var fs = require('fs');

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
console.log(web3.isConnected());
var accounts; // show all our available accounts
//web3.eth.getAccounts().then((acc) => {accounts = acc; console.log(acc)});

//Compile contracts with solc, the solidity compiler
var solc = require('solc');
var contractSrc = fs.readFileSync('./HelloWorld.sol','utf8');
var contractCom = solc.compile(contractSrc);

//Create contract object
var abi = JSON.parse(contractCom.contracts[':HelloWorld'].interface);
console.log(abi);
var bytecode = contractCom.contracts[':HelloWorld'].bytecode;
var gasEstimate = web3.eth.estimateGas({data: bytecode});
var HelloWorld = new web3.eth.contract(abi);

//Build transaction object;
var argHex = web3.toHex("hey"); //Needed because our contract constructor needs a bytes32 type
const mySenderAddress = '0xe7af1fd84a31c457976d02001a011e8cbc822bfa2e1d16904e88f3c4d0ffdccd'
// var HelloWorldReturned = HelloWorld.new(argHex, {
//     from: mySenderAddress,
//     data: bytecode,
//     gas: gasEstimate}, function(err, myContract){
//         if(!err){
//             if(myContract.address){
//                 console.log(myContract.transcationHash)
//             }
//             else
//             {
//                 console.log(myContract.address)
//             }
//         }
//     }
// )
// Deploy contract syncronous: The address will be added as soon as the contract is mined.
// Additionally you can watch the transaction by using the "transactionHash" property
var HelloWorldReturned = HelloWorld.new(argHex, {data: bytecode, gas: 300000, from: mySenderAddress});
console.log(HelloWorldReturned.transactionHash) // The hash of the transaction, which created the contract
console.log(HelloWorldReturned.address) // undefined at start, but will be auto-filled later