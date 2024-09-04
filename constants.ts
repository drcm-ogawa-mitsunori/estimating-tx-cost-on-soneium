export const EXIT_ERROR = 1;
export const FROM_ADDRESS = "0xa83114A443dA1CecEFC50368531cACE9F37fCCcb";
export const TO_ADDRESS = "0x388C818CA8B9251b393131C08a736A67ccB19297";
export const SONEIUM_MINATO_JSON_RPC_URL = "https://rpc.minato.soneium.org/";
export const SONEIUM_MINATO_CHAIN_ID = 1946;
export const SONEIUM_GAS_PRICE_ORACLE_CONTRACT_ADDRESS = "0x420000000000000000000000000000000000000F";
export const GAS_PRICE_ORACLE_ABI = [
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "getL1Fee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
];
