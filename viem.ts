import { createPublicClient, http, defineChain, serializeTransaction, parseEther, formatEther, TransactionSerializable } from "viem";
import { EXIT_ERROR, FROM_ADDRESS, GAS_PRICE_ORACLE_ABI, SONEIUM_GAS_PRICE_ORACLE_CONTRACT_ADDRESS, SONEIUM_MINATO_CHAIN_ID, SONEIUM_MINATO_JSON_RPC_URL, TO_ADDRESS } from "./constants";

export const soneiumMinato = defineChain({
  id: SONEIUM_MINATO_CHAIN_ID,
  name: 'Soneium Minato',
  nativeCurrency: { name: 'Soneium Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [SONEIUM_MINATO_JSON_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: 'Soneium Explorer',
      url: 'https://explorer-testnet.soneium.org',
      apiUrl: 'https://explorer-testnet.soneium.org/api',
    },
  },
  contracts: {
    gasPriceOracle: {
      address: SONEIUM_GAS_PRICE_ORACLE_CONTRACT_ADDRESS,
    },
  },
  testnet: true,
})

const proc = async () => {
  const publicClient = createPublicClient({
    chain: soneiumMinato,
    transport: http(),
  });

  const feePerGas = await publicClient.estimateFeesPerGas();
  console.log("feePerGas", feePerGas);
  
  const tx: TransactionSerializable = {
    type: "eip1559",
    to: TO_ADDRESS,
    nonce: await publicClient.getTransactionCount({ address: FROM_ADDRESS }),
    gas: 21000n,
    value: parseEther('0.1'),
    chainId: publicClient.chain.id,
    maxPriorityFeePerGas: feePerGas.maxPriorityFeePerGas,
    maxFeePerGas: feePerGas.maxFeePerGas,
  }
  const serializedTx = serializeTransaction(tx);
  console.log("serializedTx", serializedTx);

  const l1Fee = (await publicClient.readContract({
    address: soneiumMinato.contracts.gasPriceOracle.address,
    abi: GAS_PRICE_ORACLE_ABI,
    functionName: 'getL1Fee',
    args: [serializedTx],
  })) as bigint;
  console.log("getL1Fee", formatEther(l1Fee as any), "ETH");

  const l2Fee = (tx.gas ?? 0n) * feePerGas.maxFeePerGas;
  console.log("L2Fee", formatEther(l2Fee), "ETH");
  console.log("totalFee", formatEther(l1Fee + l2Fee), "ETH");
}

proc().catch(err => {
  console.error(err);
  process.exit(EXIT_ERROR);
});
