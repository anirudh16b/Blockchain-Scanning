var TX = require('ethereumjs-tx')
const Web3 = require('web3')
const web3 = new Web3('https://ropsten.infura.io/NX59EVFVGTVGFZAMAA815TPH5FAT155D56')

const account1 = '0x846DB6e71b480d2Aa8AC8af84dC703bB8939a3F1'
const pk1 = Buffer.from('98E8BE82C3529F379B162A34AA811D2223FA60937351CA989EE9075E287CCD34','hex'
)

const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "emailID",
				"type": "bytes16"
			}
		],
		"name": "addEmpDetails",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "createEmployee",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "employeeID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "empName",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "thisAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "passcode",
				"type": "bytes32"
			}
		],
		"name": "AddedEmployee",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "EmpAddrs",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "EmpIDs",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "EmpNames",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "EmployeeID",
				"type": "uint256"
			}
		],
		"name": "getEmployee",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getEmployees",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
        const contractAddress = '0xc334f29adf7c1e655b59509df5c9a19cf582cbae'
		var HRIT = new web3.eth.contract(abi, contractAddress, {gasLimit:'2000000000'});
		
		console.log(HRIT);


// web3.eth.getTransactionCount(account1,txCount) => {
//     const txObject = {
//         nonce: web3.utils.toHex(txCount),
//         gasLimit: web3.utils.toHex(1000000),
//         to: contractAddress,
//         data: HRIT
//     }
// }
//console.log(HRIT);

HRIT.methods.getEmployee(1).call((err, res) =>{
	if(err){
		console.log('error')
	}
		else {
		console.log(res)
	}
})

