//Instantiate web3 and make sure we can see our accounts;
var Web3 = require('web3');
var module = require('./config.js')
var web3 = module.web3

//to get transaction meta-data, mention the txn hash as arguments while starting the node
//eg. node scanTxn.js 0xd11a1d3f34606fe0cc9b001ff0e7f7ab3fbd3cbaf2dac45a990585398e7a0376 0x3f3ff93a432bd128c492313db839c56436d2104ddf7a843d849c7bb4bf2739b8
'use strict';

for (let j = 2; j < process.argv.length; j++) {
    console.log('Transaction ' + j + ' -> ' + process.argv[j])
    web3.eth.getTransaction(process.argv[j], function (err, res) {
        //console.log(web3.fromWei(res.gasPrice).toNumber(),"Ether")-> Big Number to Ether
        //console.log(web3.toAscii(res.input))
        console.log(res.to)
    })
}



