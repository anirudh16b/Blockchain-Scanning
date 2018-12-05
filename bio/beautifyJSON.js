//beautify a JSON Object
var _ = require('underscore')
//var obj ={ "blockHash": "0xaa7bfe29abafbe35b047c13f950c9a9468e40ea87fa5eebcdde5046ffee228bf", "blockNumber": 3326348, "from": "0x9f4393a2c9ec6b259fcc4bb7e8ad16538b235bbb", "gas": 37239, "gasPrice": "1000000000", "hash": "0x995aee769919afd2a0497537a6187ce8f474cc89dc5dcec3a4ddf457953802f9", "input": "0xb33c7cca0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000", "nonce": 1, "r": "0x9932d1bffde2fb6b6710e05a35717d498a6e8392194504cd36b739ceab9cfb0d", "s": "0x12c15df5be07961b801328c1c77478097e1f77c97f5a502c84fc1e287705171c", "to": "0x02d7087e7328984c173ade33d7d4053dfbe856e7", "transactionIndex": 18, "v": "0x2b", "value": "0" }
//console.log(_.keys(obj))

const json_getAllKeys = data => (
    data.reduce((keys, obj) => (
      keys.concat(Object.keys(obj).filter(key => (
        keys.indexOf(key) === -1))
      )
    ), [])
  )
  
  //console.log('json_getAllKeys: ' + json_getAllKeys(obj))

  module.exports.getKeys = function (jsonData){
      var keys = []
  for(var obj in jsonData){
    if(jsonData.hasOwnProperty(obj)){
    for(var prop in jsonData[obj]){
        if(jsonData[obj].hasOwnProperty(prop)){
           keys.push(prop + ':' + jsonData[obj][prop]);
            }
        }
        }
    }
        return keys
}

// console.log('getKeys: '+ getKeys(obj))