//JS for functions used by router to fetch relevant details
var module = require('./router')
var os = require('os')
var beautify = require('./beautifyJSON')
var web3 = module.web3

exports.blockScanner = function (fromBlock, toBlock) {
        if (fromBlock == null) { fromBlock = 0;}
        if (toBlock == null) {toBlock = blockCount;}
        var blockArray = []
    for (i = fromBlock; i <= toBlock; i++) {
        var block = JSON.parse(JSON.stringify(web3.eth.getBlock(i),null,4))
        blockArray.push(block)
        // blockArray.push("hash:"+block.hash)
        // blockArray.push("minhash:"+block.minhash)
        // blockArray.push("nonce:"+block.nonce)
        // blockArray.push("number:"+block.number)
        // blockArray.push("timestamp"+block.timestamp)
        // blockArray.push(`${os.EOL}`)
        // blockArray.push('-----------------------------------------------------')
        // blockArray.push(`${os.EOL}`)
            }
            return blockArray
        }
    
exports.blockTxnScanner = function (blockNumber){
    //var block = web3.eth.getBlock(blockNumber)
    var blockTxnArray= []
     if(module.network == 'testrpc'){
        var txn = JSON.parse(JSON.stringify(web3.eth.getTransactionFromBlock(blockNumber, 0),null, 4))
        blockTxnArray.push(txn)    
     }
     else{
    var txnCount = web3.eth.getBlockTransactionCount(blockNumber)
    //console.log('txn Count: ' + txnCount)
    for (i=0; i<=txnCount; i++){
        var txn = JSON.parse(JSON.stringify(web3.eth.getTransactionFromBlock(blockNumber, i),null, 4))
        blockTxnArray.push(txn)        
    }
    }
        return blockTxnArray
}

exports.getTxn = function (txHash){
    var txn = web3.eth.getTransaction(txHash)
    return txn
}

exports.getTxnRcpt = function (txHash){
    var txnRcpt = web3.eth.get(txHash)
    return txnRcpt
}