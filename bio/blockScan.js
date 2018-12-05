//JS to Scan entire block and write it to file
var module = require('./router')
var wait = require('wait-for-stuff')
var fs = require('fs-extra')
var level = require('level')
const os = require('os');
var sublevel = require('level-sublevel')

var db = sublevel(level('./db', { valueEncoding: 'json' }))//to insert JSON objects for key-mapping

var dbBlock = db.sublevel('blocks')
var dbTxn = db.sublevel('txns')

function writeToFile(text) {
    //seperate Log files with timestamp
    wait.for.function(fs.writeFile, './log/blockScan_' + ts + '.txt', `${text}${os.EOL}`, options);
}
function writeAllToFile(text) {
    //single log file with appended timestamp
    wait.for.function(fs.writeFile, './log/blockScan.txt', `${text}${os.EOL}`, options);
}

function writeToLine(text) {
    //seperate Log files with timestamp
    wait.for.function(fs.writeFile, './log/blockScan_' + ts + '.txt', `${text}`, options);
}

function writeAllToLine(text) {
    //single log file with appended timestamp
    wait.for.function(fs.writeFile, './log/blockScan.txt', `${text}`, options);
}

const options = { flag: 'a' };
var web3 = module.web3
var ts = Date.now()
var txType = ''

function txnType(to) {
    if (to == '0x0') {
        txType = 'Contract Creation'
    }
    else {
        txType = 'Transaction'
    }
    return txType
}
// fs.truncate('./log/blockScan_'+ts+'.txt','', function(err){
//     if(!err){
//         console.log('Log File Truncated')
//     }
// })

var blockCount = web3.eth.blockNumber
console.log('Block Count: ' + blockCount)
var fromBlock = 0
var toBlock = blockCount
console.log('from block: '+ fromBlock+' to block: '+toBlock)
if (toBlock == 'undefined') {toBlock = blockCount}
//scan the blocks
for (i = toBlock/*fromBlock*/; i <= toBlock; i++) {
    writeToFile('Block#' + i)
    var blockObject = JSON.stringify(web3.eth.getBlock(i))
    dbBlock.put('Block#' + i, { blockObj: blockObject })
    //console.log('Block#'+ i+' '+JSON.stringify(web3.eth.getBlock(i)))
    var txnCount = web3.eth.getBlockTransactionCount(i)
    //console.log('Txn Count: '+ txnCount)
    //scan all the transactions within the blocks
    for (j = 0; j < txnCount; j++) {
        var txnfromBlock = web3.eth.getTransactionFromBlock(i, j)
        var to = txnfromBlock.to
        var unixTS = web3.eth.getBlock(i).timestamp
        var blockTS = new Date(unixTS * 1000).toUTCString()
        var txType = txnType(to)
        writeToFile('Transaction# ' + j + 1 + ' ' + txType + ' Mined on: ' + blockTS)
        // console.log('Transaction# '+ j+1+ ' ' + txType + ' Mined on: '+ blockTS)
        //writeToFile(JSON.stringify(txnfromBlock))
        //console.log(JSON.stringify(txnfromBlock))

        var txnObject = {
            hash: txnfromBlock.hash,
            nonce: txnfromBlock.nonce,
            blockhash: txnfromBlock.blockHash,
            gas: txnfromBlock.gas,
            gasPrice: txnfromBlock.gasPrice,
            to: txnfromBlock.to,
            from: txnfromBlock.from
        }
        dbTxn.put('Block#' + i + 'Transaction#' + j + 1, { txnObj: JSON.stringify(txnObject) })
        writeToFile(' Hash: ' + txnObject.hash +
            ' nonce: ' + txnObject.nonce +
            ' blockhash: ' + txnObject.blockhash +
            ' gas: ' + txnObject.gas +
            ' gasPrice: ' + txnObject.gasPrice +
            ' to: ' + txnObject.to +
            ' from: ' + txnObject.from
        )//using write to file for the last line to invoke EOL at the the end
    }
}//end of block for loop


dbBlock.createReadStream()
    .on('data', function (data) {
        console.log('Block Read stream Result: ', data.key, '=', data.value)
    })
    .on('error', function (err) {
        console.log('Error', err)
    })
    .on('close', function () {
        console.log('Stream closed')
    })
    .on('end', function () {
        console.log('Stream ended')
    })

dbTxn.createReadStream()
    .on('data', function (data) {
        //console.log('Txn Read stream Result: ', data.key, '=', data.value)
    })
    .on('error', function (err) {
        console.log('Error', err)
    })
    .on('close', function () {
        console.log('Stream closed')
    })
    .on('end', function () {
        console.log('Stream ended')
    })

// var txns = []
// var stream = dbTxn.createReadStream()

// stream.on('data', function(txn){
//     console.log('txn : '+ JSON.parse(JSON.stringify(txn)) + 'txn blockNumber : ' + txn.blockNumber)
//     dbBlock.get(txn.value.blockNumber, function(err, blockNumber){
//         txn.value.blockNumber = blockNumber 
//         txns.push(txn.value)
//     })
// })
// stream.on('close', function (err){
//    console.log(txns)
// })

// const ops = [
//     { type: 'del', key: 'Txn1' },
//     { type: 'del', key: 'Txn2' },
//     { type: 'del', key: 'Txn3' },
//     { type: 'del', key: 'Txn4' },
//     { type: 'del', key: 'Transaction#01' }
// ]

// dbTxn.batch(ops, function (err) {
//     if (err) {
//         return console.log('Error')
//     }
//     else
//         console.log('Delete Success')
//})