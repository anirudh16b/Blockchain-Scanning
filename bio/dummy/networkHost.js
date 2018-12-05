function host(network){
    var index = process.argv.indexOf(network)
    if (index !== -1){
       var networkHost = process.argv[index+1]
       var host = ''
       if(networkHost.toLowerCase() == 'testrpc'){host = '127.0.0.1:8545'}
        else {host = 'https://rinkeby.infura.io'} 
        return host  
    } 
    else
         null
}

var networkHost = host('--network')
console.log(networkHost)