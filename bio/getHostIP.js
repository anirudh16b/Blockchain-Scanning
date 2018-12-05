var hostMapping = require('./hostMapping.json')
var _ = require('underscore')

exports.getIP = function(host){
    var hostIP = ''
    var JSONkeys = _.keys(hostMapping)
    for(i=0; i<=JSONkeys.length; i++){
            if(host ==JSONkeys[i]){hostIP=hostMapping[JSONkeys[i]]}
    }
    //console.log(hostIP)
    return hostIP
}