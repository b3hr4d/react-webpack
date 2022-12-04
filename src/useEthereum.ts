import { BigNumber, ethers, providers } from "ethers"
import { useEffect, useState } from "react"
import { ethereumClient } from "./constant"
import { ABI, CONTRACT_ADDRESS } from "./env"

const ERC20 = (address: string, provider: providers.Provider) =>
  new ethers.Contract(
    address,
    ["balanceOf(address) view returns (uint256)"],
    provider
  )

const useEthereum = () => {
  const [{ isConnected, address, connector }, setAccount] = useState<any>({
    isConnected: false,
    address: null,
    connector: {},
  })

  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState<BigNumber>()
  const [chainId, setChainId] = useState<number>(56)
  const [contract, setContract] = useState<ethers.Contract>()

  useEffect(() => {
    ethereumClient.watchAccount((account) => {
      setLoading(true)
      console.log("account changed", account)
      account.connector?.getSigner().then((signer: any) => {
        Promise.all([signer.getBalance(), signer.getChainId()])
          .then(([balance, chainId]) => {
            console.log("balance", balance.toString())
            console.log("chainId", chainId)
            setBalance(balance)
            setChainId(chainId)

            setContract(new ethers.Contract(CONTRACT_ADDRESS, ABI, signer))
            setLoading(false)
          })
          .catch((err) => {
            console.log(err)
            setLoading(false)
          })
      })

      setAccount(account)
    })
  }, [])

  const disconnect = () => {
    ethereumClient.disconnect()
  }

  return {
    address,
    isConnected,
    disconnect,
    chainId,
    connector,
    loading,
    balance,
    contract,
  }
}

export default useEthereum
