//https://www.youtube.com/watch?v=sR7p_JbEip0

var level = require('level')
var sublevel = require('level-sublevel')
var wait = require('wait-for-stuff')
var fs = require('fs-extra')

var db = sublevel(level('./db', { valueEncoding: 'json' }))

var blockdb = db.sublevel('blocks')
var txndb = db.sublevel('txns')

blockdb.put('Block1', { blockNumber: '1' }, function (err) {
    txndb.put('Txn1', { txnNumber: '1', blockNumber: 'Block1' }, function (err) {
    })
    txndb.put('Txn2', { txnNumber: '2', blockNumber: 'Block1' }, function (err) {
    })
})

blockdb.put('Block2', { blockNumber: '2' }, function (err) {
    txndb.put('Txn3', { txnNumber: '3', blockNumber: 'Block2' }, function (err) {
    })
    txndb.put('Txn4', { txnNumber: '4', blockNumber: 'Block2' }, function (err) {
    })
})

txndb.get('Txn4', function (err, txn) {
    blockdb.get(txn.blockNumber, function (err, block) {
        console.log(JSON.stringify(txn) + ' ' + JSON.stringify(block))
    })
})

var txns = []
var stream = txndb.createReadStream()

stream.on('data', function (txn) {
    blockdb.get(txn.value.blockNumber, function (err, blockNumber) {
        //txn.value.blockNumber = blockNumber 
        //txns.push(txn.value)
    })
})
stream.on('close', function (err) {
    console.log(txns)
})

