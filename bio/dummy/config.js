
var host = require('../router').networkHost
console.log('From config file, network selected: '+ host)
const port = 3000
//https://rinkeby.etherscan.io/tx/0xfe117a4536ba74185e962005a1e836010210a5b74eeb92ee609fe9d169ef32f0
//Rinkeby Contract Address Creation Tx Hash = 0xfe117a4536ba74185e962005a1e836010210a5b74eeb92ee609fe9d169ef32f0
const HelloWorldAddress = '0x02d7087e7328984c173ade33d7d4053dfbe856e7' //contract  Address
const HelloWorldABI = [{ "constant": false, "inputs": [{ "name": "name", "type": "string" }], "name": "welcomeMssg", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getMessage", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "mymessage", "type": "string" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "message", "type": "string" }], "name": "evntGetMessage", "type": "event" }]
const BankRegulatorAddress = '0x9094e0bf6f9e2812e3fbb903a30e192fd947dcc9'
const BankRegulatorABI = [{ "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "checkValue", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "deposit", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "loan", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "amount", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "constant": true, "inputs": [], "name": "balance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }]
var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider(host));

module.exports = {
    web3,
    host,
    HelloWorldAddress,
    HelloWorldABI,
    BankRegulatorAddress,
    BankRegulatorABI,
    port
}