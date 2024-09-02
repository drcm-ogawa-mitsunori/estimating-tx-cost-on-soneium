import "dotenv/config";
import { ethers } from "ethers";
import * as optimism from "@eth-optimism/sdk";

const EXIT_ERROR = 1;

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

  const gasLimit = tx.gasLimit as any
  const gasPrice = tx.maxFeePerGas as any;
  const l2CostEstimate = gasLimit.mul(gasPrice);
  console.log("l2CostEstimate", ethers.utils.formatEther(l2CostEstimate), "ETH");

  const l1CostEstimate = await provider.estimateL1GasCost(tx);
  console.log("l1CostEstimate", ethers.utils.formatEther(l1CostEstimate), "ETH");

  const totalSum = l2CostEstimate.add(l1CostEstimate);
  console.log("totalSum", ethers.utils.formatEther(totalSum), "ETH");
}

proc().catch(err => {
  console.error(err);
  process.exit(EXIT_ERROR);
});
