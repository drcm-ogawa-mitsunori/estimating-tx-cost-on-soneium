import "dotenv/config";
import { ethers } from "ethers";
import * as optimism from "@eth-optimism/sdk";

const EXIT_ERROR = 1;

const L1GasPriceAbi = [
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
]

// NOTE: https://docs.optimism.io/builders/app-developers/tutorials/sdk-estimate-costs を再現
const proc = async () => {
  const ethersProvider = new ethers.providers.StaticJsonRpcProvider("https://rpc.minato.soneium.org/", 1946);
  const provider = optimism.asL2Provider(ethersProvider);
  const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY ?? "", provider);

  const tx = await wallet.populateTransaction({
    to: "0xa7cf71d2383c5d20960Ed4557E2f05BB3f23cBA2",
    value: ethers.utils.parseEther("0.1"),
    gasPrice: await provider.getGasPrice(),
  });

  /* Optimism SDK を使ったやり方 */

  const gasLimit = tx.gasLimit as any
  const gasPrice = tx.maxFeePerGas as any;
  const l2CostEstimate = gasLimit.mul(gasPrice);
  console.log("l2CostEstimate", ethers.utils.formatEther(l2CostEstimate), "ETH");

  const l1CostEstimate = await provider.estimateL1GasCost(tx);
  console.log("l1CostEstimate", ethers.utils.formatEther(l1CostEstimate), "ETH");

  const totalSum = l2CostEstimate.add(l1CostEstimate);
  console.log("totalSum", ethers.utils.formatEther(totalSum), "ETH");

  const optimismTotalSum = await optimism.estimateTotalGasCost(provider, tx);
  console.log("estimateTotalGasCost", ethers.utils.formatEther(optimismTotalSum), "ETH");

  /* 直接 GasPriseOracle を見に行くやり方 */

  const unsignedTx = {
    type: tx.type,
    to: tx.to,
    nonce: tx.nonce ? parseInt(tx.nonce.toString()) : (await wallet.getTransactionCount()),
    gasLimit: tx.gasLimit,
    gasPrice: tx.gasPrice,
    data: tx.data,
    value: tx.value,
    chainId: tx.chainId,
    maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
    maxFeePerGas: tx.maxFeePerGas,
    accessList: tx.accessList,
  };
  const serializeTx = ethers.utils.serializeTransaction(unsignedTx);
  console.log("serializeTx", serializeTx);

  const gasPriceOracle = new ethers.Contract("0x420000000000000000000000000000000000000F", L1GasPriceAbi, provider);
  const l1Fee = await gasPriceOracle.getL1Fee(serializeTx);
  console.log("getL1Fee", ethers.utils.formatEther(l1Fee), "ETH");
}

proc().catch(err => {
  console.error(err);
  process.exit(EXIT_ERROR);
});
