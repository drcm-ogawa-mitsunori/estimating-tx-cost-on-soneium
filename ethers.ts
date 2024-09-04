import "dotenv/config";
import { ethers } from "ethers";
import { EXIT_ERROR, GAS_PRICE_ORACLE_ABI, SONEIUM_GAS_PRICE_ORACLE_CONTRACT_ADDRESS, SONEIUM_MINATO_CHAIN_ID, SONEIUM_MINATO_JSON_RPC_URL } from "./constants";

const proc = async () => {
  const provider = new ethers.JsonRpcProvider(SONEIUM_MINATO_JSON_RPC_URL, SONEIUM_MINATO_CHAIN_ID);
  const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY ?? "", provider);

  const { maxFeePerGas, maxPriorityFeePerGas } = await provider.getFeeData();
  if (!maxFeePerGas) {
    throw new Error('maxFeePerGas is null.');
  } else if (!maxPriorityFeePerGas) {
    throw new Error('maxPriorityFeePerGas is null.');
  }
  console.log("maxFeePerGas", maxFeePerGas);
  console.log("maxPriorityFeePerGas", maxPriorityFeePerGas);

  const unsignedTx = new ethers.Transaction();
  unsignedTx.type = 2;
  unsignedTx.to = "0xa7cf71d2383c5d20960Ed4557E2f05BB3f23cBA2";
  unsignedTx.nonce = await wallet.getNonce();
  unsignedTx.gasLimit = 21000;
  unsignedTx.value = ethers.parseEther("0.1");
  unsignedTx.chainId = 1946;
  unsignedTx.maxPriorityFeePerGas = maxPriorityFeePerGas;
  unsignedTx.maxFeePerGas = maxFeePerGas;
  unsignedTx.accessList = null;
  console.log("serializedTx", unsignedTx.unsignedSerialized);

  const gasPriceOracle = new ethers.Contract(SONEIUM_GAS_PRICE_ORACLE_CONTRACT_ADDRESS, GAS_PRICE_ORACLE_ABI, provider);
  const l1Fee = await gasPriceOracle.getL1Fee(unsignedTx.unsignedSerialized);
  console.log("getL1Fee", ethers.formatEther(l1Fee), "ETH");

  const l2Fee = unsignedTx.gasLimit * maxFeePerGas;
  console.log("L2Fee", ethers.formatEther(l2Fee), "ETH");
  console.log("totalFee", ethers.formatEther(l1Fee + l2Fee), "ETH");
}

proc().catch(err => {
  console.error(err);
  process.exit(EXIT_ERROR);
});
