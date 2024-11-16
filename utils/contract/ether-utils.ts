import { InterfaceAbi } from "ethers";
import { Interface } from "ethers";
import { ethers, Contract } from "ethers";

// Load environment variables
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Optional: Create a signer for write transactions (requires PRIVATE_KEY)
const PRIVATE_KEY = process.env.PRIVATE_KEY as string | undefined;
const signer = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : null;

/**
 * Get a contract instance
 * @param address - Smart contract address
 * @param abi - Smart contract ABI
 * @returns Contract instance
 */
export const getContract = (address: string, abi: Interface | InterfaceAbi): Contract => {
  return new ethers.Contract(address, abi, signer || provider);
};

/**
 * Example: Call a read function on a contract
 * @param address - Contract address
 * @param abi - Contract ABI
 * @param method - Method name
 * @param args - Method arguments
 * @returns Promise<any> - The result of the function call
 */
export const callReadFunction = async <T>(
  address: string,
  abi: Interface | InterfaceAbi,
  method: string,
  args: any[] = []
): Promise<T> => {
  const contract = getContract(address, abi);
  return contract[method](...args) as Promise<T>;
};

/**
 * Example: Send a transaction (write) to a contract
 * @param address - Contract address
 * @param abi - Contract ABI
 * @param method - Method name
 * @param args - Method arguments
 * @returns Promise<any> - Transaction receipt
 */
export const sendWriteTransaction = async (
  address: string,
  abi: Interface | InterfaceAbi,
  method: string,
  args: any[] = []
) => {
  if (!signer) throw new Error("Signer is required for write transactions");
  const contract = getContract(address, abi);
  const tx = await contract[method](...args);
  return tx.wait(); // Wait for transaction to be mined
};
