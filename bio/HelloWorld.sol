pragma solidity ^0.4.0;

contract HelloWorld {
  string message;
  string _data;
  event evntGetMessage(string message);
  event txnMetaData(string _data);
  
  constructor(string mymessage) public {
    message =  mymessage;
  emit evntGetMessage(message);
   _data = string(abi.encodePacked("Contract Creation HelloWorld -> arguments: "," ", message));
  emit txnMetaData(_data);
  }

  function getMessage() external view returns(string) {
    return message;
  }
  
  function welcomeMssg(string name) external returns (string){
     message =  string(abi.encodePacked(message, " ", name));
     emit evntGetMessage(message);
     _data = string(abi.encodePacked("Contract HelloWorld -> Function Call welcomeMssg() -> arguments: "," ", name));
     emit txnMetaData(_data);
     return string(abi.encodePacked(message, " ", name));
  } 
}