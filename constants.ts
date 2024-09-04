export const EXIT_ERROR = 1;
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
