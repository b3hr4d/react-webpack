import { useCallback, useEffect, useMemo, useState } from "react"
import { multicall, SELECTABLE_TOKEN, tokens, toUsd } from "./constant"

const usePriceFeed = (payAmount: number, refetch = 30) => {
  const [prices, setPrices] = useState<any>()

  const fetchPrice = useCallback(() => {
    multicall.aggregate(tokens).then((res: any) => {
      const blockNumber = res.blockNumber.toNumber()
      const prices = SELECTABLE_TOKEN.reduce(
        (all, { token, decimals }, i) => {
          const price = toUsd(res.returnData[i])
          const amount = payAmount / res.returnData[i]
          return { ...all, [token]: { price, amount, decimals } }
        },
        { blockNumber }
      )
      setPrices(prices)
    })
  }, [])

  console.log("prices", prices)
  useEffect(() => {
    const timer = setInterval(() => fetchPrice(), refetch * 1000)
    fetchPrice()

    return () => clearInterval(timer)
  }, [])

  const nextFetch = useMemo(() => (prices ? refetch * 1000 : 0), [prices])

  return { prices, nextFetch }
}

export default usePriceFeed
