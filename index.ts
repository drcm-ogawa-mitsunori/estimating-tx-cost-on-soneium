import { ethers } from "ethers";

const EXIT_ERROR = 1;

const proc = async () => {
  const provider = new ethers.JsonRpcProvider("https://rpc.minato.soneium.org/", 1946);
  console.log(await provider.getBlockNumber());
}

proc().catch(err => {
  console.error(err);
  process.exit(EXIT_ERROR);
});
