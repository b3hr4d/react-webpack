import { useWeb3Modal, Web3Modal } from "@web3modal/react"
import { useCallback, useState } from "react"
import {
  ethereumClient,
  fromWie,
  minimizer,
  SELECTABLE_TOKEN,
  usdToToken,
} from "./constant"
import { CHAIN, CONTRACT_ADDRESS, EXPLORER } from "./env"
import ProgressRing from "./ProgressRing"
import useEthereum from "./useEthereum"
import usePriceFeed from "./usePriceFeed"

const selectedPlan = 600000000
const timer = 30

function App() {
  const { open } = useWeb3Modal()
  const [selectedToken, setSelectedToken] = useState(SELECTABLE_TOKEN[0].token)
  const {
    address,
    isConnected,
    chainId,
    balance,
    disconnect,
    connector,
    contract,
  } = useEthereum()

  const { prices, nextFetch } = usePriceFeed(selectedPlan, timer)

  const buyVpn = useCallback(() => {
    if (chainId !== CHAIN || !contract || !prices) return
    const value = usdToToken(
      prices[selectedToken].amount,
      prices[selectedToken].decimals
    )
    contract
      .Pay("0x0000000000000000000000000000000000000000", 1, {
        value,
      })
      .then((tx: any) => {
        console.log(tx)
        tx.wait(6).then((receipt: any) => {
          console.log(receipt)
          // go callback url
        })
      })
  }, [contract, prices])

  return (
    <div className="container space-top-1 space-top-lg-3" dir="rtl">
      <Web3Modal
        projectId="8b08de3bff9b5337a430627313fc1057"
        ethereumClient={ethereumClient}
      />
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-center">پرداخت اختصاصی HiVPN</h5>
              <hr />
              <p className="card-text text-center">
                لطفا توکن یا کوین مورد نظر خود را انتخاب کنید.
              </p>
              <div className="text-center mb-2">
                <div className="row justify-content-center">
                  {SELECTABLE_TOKEN.map(({ token, logo, decimals }) => (
                    <div className="col-6 col-md-2 mb-2" key={token}>
                      <div
                        className={`card ${
                          selectedToken === token
                            ? "bg-danger bg-opacity-25"
                            : ""
                        }`}
                        style={{
                          backgroundImage: `url(${logo})`,
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedToken(token)}
                      >
                        <div
                          className="card-body"
                          style={{
                            backdropFilter: "blur(5px)",
                          }}
                        >
                          <h5 className="card-title text-center">{token}</h5>
                          <p className="card-text text-center">
                            {balance ? fromWie(balance, decimals) : "0"}
                            <small className="text-primary">{token}</small>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <hr />
              <div className="card-text">
                {isConnected ? (
                  <div className="text-center">
                    اتصال از طریق {connector?.name} با موفقیت انجام شد.
                    <ul className="text-right list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span className="text-muted">آدرس کیف پول:</span>{" "}
                        <span className="text-primary">
                          {minimizer(address)}
                        </span>
                      </li>
                      {/* {balance && (
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <span className="text-muted">موجودی:</span>{" "}
                          <span className="text-primary">
                            {utils.formatEther(balance)} {selectedToken}
                          </span>
                        </li>
                      )} */}
                      {prices && (
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <span className="text-muted">
                            قیمت هر یک از {selectedToken}:
                          </span>{" "}
                          <span className="text-primary">
                            {prices[selectedToken].price}~
                          </span>
                        </li>
                      )}
                      {prices && (
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <span className="text-muted">قابل پرداخت:</span>{" "}
                          <span className="text-primary">
                            {prices[selectedToken].amount.toFixed(6)}{" "}
                            {selectedToken}
                          </span>
                        </li>
                      )}
                    </ul>
                    <div className="text-center pt-2">
                      <button
                        className="btn btn-primary btn-block"
                        onClick={buyVpn}
                      >
                        پرداخت
                      </button>
                      <button
                        className="btn btn-danger btn-block"
                        onClick={disconnect}
                      >
                        قطع اتصال
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-right pt-2">
                    <p className="text-center">
                      لطفا به کیف پول دیجیتال خود متصل شوید.
                    </p>
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => open()}
                    >
                      اتصال به کیف پول
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="card-footer text-muted text-center d-flex justify-content-between align-items-center">
              <span>
                <span className="text-danger">هشدار:</span> لطفا قبل از پرداخت
                به آدرس سایت توجه کنید.
              </span>
              <a
                href={`${EXPLORER}address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
              >
                <small>{prices?.blockNumber}</small>
                {nextFetch ? (
                  <ProgressRing radius={8} stroke={2} duration={nextFetch} />
                ) : (
                  <small className="text-danger">در حال بروزرسانی...</small>
                )}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
