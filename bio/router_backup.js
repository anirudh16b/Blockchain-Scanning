// var fs = require('fs')
var express = require('express')
var http = require('http')
var getHostIP = require('./getHostIP')
var mysql = require('mysql')
function host(network) {
    var index = process.argv.indexOf(network)
    var hostIP = ''
    if (index !== -1) {
        var choice = process.argv[index + 1]
        hostIP = getHostIP.getIP(choice.toLowerCase())
    }
    else { hostIP = null }
    return hostIP
}

if (process.argv.slice(3) != null) {
    var host = host('--network')
    console.log('Process network: ' + host)
}

console.log("Host: " + host)
var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider(host));
const port = process.argv[5]
const network = process.argv[3]
console.log('Port: ' + port)

module.exports = {
    host,
    network,
    port,
    web3
}

var latestFile = require('./latestFile')
var os = require('os')
var block = require('./blockScanner')
var app = express()
var server = http.createServer(app);

var latestLogFile = latestFile.getMostRecentFileName(__dirname + '/log')
console.log('Latest Log File: ' + latestLogFile)

app.get('/', function (req, res) {
    res.send("Block Scanner");
});

app.get('/scan', function (req, res) {
    res.sendFile(__dirname + '/log/' + latestLogFile)
});

app.get('/scan/fromBlock/:from/toBlock/:to', function (req, res) {
    var blocks = block.blockScanner(req.params.from, req.params.to)
    res.send(blocks)
});

app.get('/scan/getTxnfromBlock/:blockNumber', function (req, res) {
    var txn = block.blockTxnScanner(req.params.blockNumber)
    res.send(txn)
})

app.get('/scan/getByTxnHash/:txHash', function (req, res) {
    var txn = block.getTxn(req.params.txHash)
    var txnObj = {
        "blockHash: ": txn.blockHash,
        " blockNumber: ": txn.blockNumber,
        " from: ":txn.from,
        " gas: ":txn.gas,
        " gasPrice: ":txn.gasPrice,
        " hash: ":txn.hash,
        " input:":txn.input,
        " nonce: ":txn.nonce,
        " r: ":txn.r,
        " s: ":txn.s,
        " to: ":txn.to,
        " transactionIndex: ":txn.transactionIndex,
        " v: ":txn.v,
        " value: ":txn.value
    }
    // res.send("blockHash: " + txnObj.blockHash + "\n" +
    // "\n"+" blockNumber: "+txnObj.blockNumber+"\n" +
    // "\n"+" from: "+txnObj.from+"\n" +
    // "\n"+" gas: "+txnObj.gas+"\n" +
    // "\n"+" gasPrice: "+txnObj.gasPrice+"\n" +
    // "\n"+" hash: "+txnObj.hash+"\n" +
    // "\n"+" input:"+txnObj.input+"\n" +
    // "\n"+" nonce: "+txnObj.nonce+"\n" +
    // "\n"+" r: "+txnObj.r+"\n" +
    // "\n"+" s: "+txnObj.s+"\n" +
    // "\n"+" to: "+txnObj.to+"\n" +
    // "\n"+" transactionIndex: "+txnObj.transactionIndex+"\n" +
    // "\n"+" v: "+txnObj.v+"\n" +
    // "\n"+" value: "+txnObj.value)
    //console.log(txnObj)
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(txn)
})

app.get('/scan/getBlockNumber/:blockNumber', function (req, res) {
    var blocks = block.blockScanner(req.params.blockNumber, req.params.blockNumber)
    res.send(blocks)
})

app.get('/scan/latestBlock', function (req, res) {
    var count = web3.eth.blockNumber
    res.send("Block Count: " + count)
})

app.get('/scan/getTxnEvent/:txHash', function (req, res) {
    var dbConfig = require('./dbConfig.json')
    var AllEvents = require('web3/lib/web3/allevents')
    var SolidityCoder = require("web3/lib/solidity/coder.js");
    var SolidityEvent = require("web3/lib/web3/event.js");

    var connection = mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database
    });

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

    connection.connect(function (err) {
        if (err) { res.send('Error in DB connection: ' + err) }
        else {
            console.log('Connected to DB successfully!!')
        }
    });

    connection.query(txnsql, contractAddress, function (error, results, fields) {
        if (error) { throw error }
        else {
            var contractABI = JSON.parse(results[0].contract_abi)
            //console.log('contract ABI: ' + JSON.stringify(contractABI))

            var receipt = JSON.parse(JSON.stringify(web3.eth.getTransactionReceipt(req.params.txHash)))
            console.log('Receipt: ' + JSON.stringify(receipt))
            var eventsArray = []
            for (i in receipt.logs) {
                var log = receipt.logs[i]
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
                    eventsArray.push('Event: ' + signature + 'logs: ' + data)

                }
            }
            res.send(eventsArray)
        }
        connection.end();
    })
});

app.get('/scan/getTxnByContract/:contractAddress/toBlock/:toBlock', function (req, res) {
    var dbConfig = require('./dbConfig.json')
    var AllEvents = require('web3/lib/web3/allevents')
    var SolidityCoder = require("web3/lib/solidity/coder.js");
    var SolidityEvent = require("web3/lib/web3/event.js");

    var connection = mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database
    })

    var contractAddress = req.params.contractAddress

    connection.connect(function (err) {
        if (err) { res.send('Error in DB connection: ' + err) }
        else {
            console.log('Connected to DB successfully!!')
        }
    })

    var txnsql = 'SELECT contract_address, contract_txn from abi_address_map where contract_address=?'
    //console.log('API Query: ' + txnsql + contractAddress)
    connection.query(txnsql, [contractAddress], function (error, results, fields) {
        if (error) {
            console.log('Connection query error!!!' + this.sql + '; Error = ' + error)
        }
        else {
            var txnStr = JSON.stringify(results)
            //console.log('Txn txnStr: ' + txnStr)
            var txnObj = JSON.parse(txnStr)
            //console.log('Txn Object: ' + txnObj)
            var txnHash = txnObj[0].contract_txn///got the txn of the contract address from MySQL
            //console.log('Txn Hash: ' + txnHash)

            var txn = block.getTxn(txnHash)
            var startingBlock = txn.blockNumber
            var blockCount = ''
            if (req.params.toBlock == null || req.params.toBlock == undefined) {
                blockCount = web3.eth.blockNumber
            }
            else {
                blockCount = req.params.toBlock
            }
            var contractTxn = []
            contractTxn.push('Contract Creation: ' + JSON.stringify(txn))
            //console.log('Starting Block = ' + startingBlock + ' Block Count = ' + blockCount)
            for (var i = startingBlock; i <= blockCount; i++) {
                var blockTxn = block.blockTxnScanner(i)
                //console.log('Block number= ' + i + ' ' + JSON.stringify(blockTxn))
                //console.log('Length of blockTxn: ' + blockTxn.length)

                for (var k = 0; k <= blockTxn.length; k++) {
                    //console.log('BlockTxn: ' + JSON.stringify(blockTxn[k]))
                    if (blockTxn[k] != null || blockTxn[k] != undefined) {
                        if (blockTxn[k].to === '0x0' || blockTxn[k].to == undefined || !blockTxn[k].to) {
                            //console.log('0x0 Not part of contract')
                        }
                        else if (blockTxn[k].to == contractAddress) {
                            //console.log('Part of contract')
                            contractTxn.push(blockTxn[k])
                        }
                        else {
                            //console.log('Not part of contract')
                        }
                    }
                    else {
                        // console.log('Block Transaction is null') 
                    }
                }
            }
            res.send(contractTxn)
        }
    })
});
//app.get

server.listen(port, 'localhost');
server.on('listening', function () {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});