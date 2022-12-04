import { Chain } from "wagmi"
import HiVPN from "./contracts"

const IS_DEV = process.env.REACT_APP_NODE_ENV === "development"

export const CHAIN = IS_DEV ? 97 : 56

export const SERVER_URL = (
  IS_DEV
    ? process.env.REACT_APP_DAPP_URL_TESTNET
    : process.env.REACT_APP_DAPP_URL
) as string

export const APP_ID = (
  IS_DEV ? process.env.REACT_APP_APP_ID_TESTNET : process.env.REACT_APP_APP_ID
) as string

export const RPC_PROVIDER = (
  IS_DEV
    ? process.env.REACT_APP_RPC_PROVIDER_TESTNET
    : process.env.REACT_APP_RPC_PROVIDER
) as string

export const SELECTED_CHAIN: Chain = HiVPN.networks[CHAIN]

export const EXPLORER = HiVPN.networks[CHAIN].blockExplorers.default.url

export const CONTRACT_ADDRESS = HiVPN.networks[CHAIN].address

export const ABI = HiVPN.abi

console.log(IS_DEV ? "testnet" : "main", process.env.REACT_APP_NODE_ENV)

export type Web3ProviderType =
  | "metamask"
  | "walletconnect"
  | "walletConnect"
  | "wc"
  | "magicLink"
  | "web3Auth"
