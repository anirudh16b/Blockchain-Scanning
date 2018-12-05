var express = require('express')
var mysql = require('mysql')
var app = express()
var module = require('./router')
var dbConfig = require('./dbConfig.json')
var AllEvents = require('web3/lib/web3/allevents')
var SolidityCoder = require("web3/lib/solidity/coder.js");
var SolidityEvent = require("web3/lib/web3/event.js");
var web3 = module.web3

console.log('Host: '+ module.host)

var connection = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database
});

connection.connect(function (err) {
  if (err) { res.send('Error in DB connection: ' + err) }
  else {
    console.log('Connected to DB successfully!!')
  }
});

app.get('/:txHash', function (req, res) {
  var txn = web3.eth.getTransaction(req.params.txHash)
  var txnObj = JSON.parse(JSON.stringify(txn))
  console.log('TxnObject= ' + txnObj)
  var to = ''
  console.log('Txn To = ' + to)
  var contractAddress = ''//undefined for a transaction->then fetch the "to" address from the transaction and find the "to" address in mysql DB and find the corresponding abi
  if (!txnObj.to || txnObj.to == '0x0') {
    to = '0x0'
    console.log('To=0x0')
    var txnRcpt = JSON.stringify(web3.eth.getTransactionReceipt(req.params.txHash))
    contractAddress = JSON.parse(txnRcpt).contractAddress
  }
  else {
    to = txnObj.to
    contractAddress = txnObj.to
    console.log('contractAddress= ' + contractAddress)
  }
  console.log('Query Contract Address: ' + contractAddress)
  var txnsql = 'SELECT contract_name, contract_abi,contract_address, contract_txn, contract_network from abi_address_map where contract_address=?'
  connection.query(txnsql, contractAddress, function (error, results, fields) {
    if (error) { throw error }
    else {
      var contractABI = JSON.parse(results[0].contract_abi)
      console.log('contract ABI: ' + JSON.stringify(contractABI))
      var contractInstance = JSON.stringify(web3.eth.contract(contractABI).at(contractAddress))
      //var contractEvent = contractInstance.allEvents({from: req.params.txHash})
      console.log('contractInstance: ' + contractInstance)

      ///////TO DO -> Fetch the Events
      var receipt = JSON.parse(JSON.stringify(web3.eth.getTransactionReceipt(req.params.txHash)))
      console.log('Receipt: ' + receipt)
      var log = receipt.logs[0];
      var event = null;
      for (var i = 0; i < contractABI.length; i++) {
        var item = contractABI[i];
        if (item.type != "event") continue;
        var signature = item.name + "(" + item.inputs.map(function (input) { return input.type; }).join(",") + ")";
        console.log(signature)
        var hash = web3.sha3(signature);
        if (hash == log.topics[0]) {
          event = item;
          break;
        }
      }
      if (event != null) {
        var inputs = event.inputs.map(function (input) { return input.type; });
        var data = SolidityCoder.decodeParams(inputs, log.data.replace("0x", ""));
        console.log(('Event: ' + signature + 'logs: ' + data))
        res.send('Event: ' + signature + 'logs: ' + data)
      }    
    }
    //connection.end();
  })//
})//app.get

app.listen(1337)
console.log('Listening to port 1337')