import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum"
import { Contract, providers, utils } from "ethers"
import { configureChains, createClient } from "wagmi"
import bnbLogo from "./assets/Bnb.svg"
import busdLogo from "./assets/Busd.svg"
import daiLogo from "./assets/Dai.svg"
import usdcLogo from "./assets/Usdc.svg"
import usdtLogo from "./assets/Usdt.svg"
import { SELECTED_CHAIN } from "./env"

export const minimizer = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const usdToToken = (usd: number, decimal: number) => {
  return (usd * 10 ** decimal).toFixed()
}

export const fromWie = (value: any, decimal = 8, fixed = 4) =>
  value && Number(utils.formatUnits(value, decimal)).toFixed(fixed)

export const toWie = (value: any) => value && Number(utils.formatEther(value))

export const toUsd = (value: any, format = true, maximumFractionDigits = 2) => {
  if (isNaN(Number(value))) return 0
  return format
    ? Number(fromWie(Math.floor(value), 8)).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits,
      })
    : Number(fromWie(Math.floor(value), 8))
}

export const MULTI_ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "bytes", name: "callData", type: "bytes" },
        ],
        internalType: "struct Multicall.Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "aggregate",
    outputs: [
      { internalType: "uint256", name: "blockNumber", type: "uint256" },
      { internalType: "bytes[]", name: "returnData", type: "bytes[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
]

const chains = [SELECTED_CHAIN]

const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: "8b08de3bff9b5337a430627313fc1057" }),
])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "HiVpn", chains }),
  provider,
})

// Web3Modal Ethereum Client
export const ethereumClient = new EthereumClient(wagmiClient, chains)

export const SELECTABLE_TOKEN = [
  {
    token: "BNB",
    decimals: 18,
    logo: bnbLogo,
    target: "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526",
  },
  {
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    token: "USDC",
    decimals: 18,
    logo: usdcLogo,
    target: "0x90c069C4538adAc136E051052E14c1cD799C41B7",
  },
  {
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    token: "DAI",
    decimals: 18,
    logo: daiLogo,
    target: "0xE4eE17114774713d2De0eC0f035d4F7665fc025D",
  },
  {
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    token: "USDT",
    decimals: 18,
    logo: usdtLogo,
    target: "0xEca2605f0BCF2BA5966372C99837b1F182d3D620",
  },
  {
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    token: "BUSD",
    decimals: 18,
    logo: busdLogo,
    target: "0x9331b55D9830EF609A2aBCfAc0FBCE050A52fdEa",
  },
]

export const rpcProvider = new providers.JsonRpcProvider(
  "https://damp-solemn-lambo.bsc-testnet.discover.quiknode.pro/c0b5ce67fac60125d94f8aa41270acc49e481d5c/"
)

export const multicall = new Contract(
  "0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C",
  MULTI_ABI,
  rpcProvider
)

export const tokens = SELECTABLE_TOKEN.map(({ target }) => ({
  target,
  callData: "0x50d25bcd",
}))
