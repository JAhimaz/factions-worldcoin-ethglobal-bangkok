import { InterfaceAbi } from "ethers";
import { Interface } from "ethers";

// Define a type for contract details
export interface ContractDetails {
  address: string;
  abi: any
}

// Export your contracts
export const CONTRACTS: Record<string, ContractDetails> = {
  Test: {
    address: "0x4200000000000000000000000000000000000016",
    abi: require("../../abi/Test.json") as Interface | InterfaceAbi,
  }
};
