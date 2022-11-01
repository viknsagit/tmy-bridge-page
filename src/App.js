import { useState, useEffect } from "react";
import './styles/App.css';
import Web3 from 'web3';


function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userAdress, setUserAdress] = useState("");
  const [getTxString, setTxString] = useState("");
  const [getTxBool, setTxBool] = useState(false);
  const [getChainId, setChainId] = useState()
  const [getTokenAmount, setTokenAmount] = useState("")
  const [getTransferAddress, setTransferAddress] = useState("")
  const [getCurrentTransfer,setCurrentTransfer] = useState("tmy")
  const [getTransferNet,setTransferNet] = useState("binance")
  

  async function transfer() {
    console.log({userAdress}.userAdress)
    
    if(getCurrentTransfer === 'binance')
    {
      if (getChainId !== networks.binance.chainId) {
        await handleNetworkSwitch('tmy')
      }
      else{
        var response = await fetch('http://95.105.118.187:3120/api/send/?address=' + { userAdress }.userAdress + "&amount=" + getTokenAmount + "&net=binance");
      }
    }
    else if(getCurrentTransfer === 'tmy')
    {
      if (getChainId !== networks.tmy.chainId) {
        await handleNetworkSwitch('binance')
      }
      else
      {
         var response = await fetch('http://95.105.118.187:3120/api/send/?address=' + { userAdress }.userAdress + "&amount=" + getTokenAmount + "&net=tmy");
      }
    }
  }
  async function changeTransferNet(){
    if(getCurrentTransfer === 'tmy')
    {
      setTransferNet("tmy")
      setCurrentTransfer('binance')
      return;
    }
    if(getCurrentTransfer === 'binance')
    {
      setTransferNet("binance")
      setCurrentTransfer('tmy')
      return;
    }
    
  }

  async function getTmy() {
    if (getChainId !== networks.tmy.chainId) {
      await handleNetworkSwitch("tmy")
    }
    else {
      var response = await fetch('http://95.105.118.187:3000/api/send/?address=' + { userAdress }.userAdress);
      var json = await response.json()
      var msg = json['msg']
      if (msg !== "Time has not yet passed") {
        var tx = json['tx']
        setTxString(tx)
        setTxBool(true)
      }
    }

  }

  function openTmyChainSite() {
    window.location.href = 'https://wallet.tmychain.org/#';
  }

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;

    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.log("Non-ethereum browser detected. You should install Metamask");
    }
    return provider;
  };

  async function onConnect() {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        setChainId(web3.eth.getChainId())
        var currentChainId = await web3.eth.getChainId()
        setChainId(`0x${Number(currentChainId).toString(16)}`)
        const userAccount = await web3.eth.getAccounts();
        //var balance = await web3.eth.getBalance(userAccount[0])
        var account = userAccount[0]
        setUserAdress(account);
        //setUserBalance(Web3.utils.fromWei({ balance }.balance, 'ether'))
        setIsConnected(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const onDisconnect = () => {
    setIsConnected(false);
  }

  const networks = {
    tmy: {
      chainId: `0x${Number(5777).toString(16)}`,
      chainName: "Ganache",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18
      },
      rpcUrls: ["ws://127.0.0.1:7545"],
      blockExplorerUrls: ["https://tmyscan.com"]
    },
    binance: {
      chainId: `0x${Number(5888).toString(16)}`,
      chainName: "Goerli",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18
      },
      rpcUrls: ["ws://127.0.0.1:8545"],
      blockExplorerUrls: ["https://tmyscan.com"]
    }

  };

  const changeNetwork = async ({ networkName }) => {
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...networks[networkName]
          }
        ]
      });
    } catch (err) {
      console.log(err)
    }
  };

  const handleNetworkSwitch = async (networkName) => {
    await changeNetwork({ networkName });
  };

  const networkChanged = (chainId) => {
    console.log({ chainId });
    setChainId({ chainId }.chainId)
  };

  useEffect(() => {
    window.ethereum.on("chainChanged", networkChanged);

    return () => {
      window.ethereum.removeListener("chainChanged", networkChanged);
    };
  }, []);

  return (
    <div>
      <header style={{
        margin: 80,
      }}>
        <div style={{
          padding: 10,
          borderRadius: 15,
          border: "solid",
          borderInlineColor: "#F7F8FC",
          borderBlockColor: "#F7F8FC",
          backgroundColor: "#F7F8FC",
        }}>

          <div class='wrapper' style={{
            display: 'grid',
            gridTemplateColumns: '10fr  1fr'
          }}>
            <div >
              <img src={process.env.PUBLIC_URL + "img/wallet-logo.svg"} alt=" " />
              <text style={{
                fontSize: 30,
                marginLeft: 10,
                verticalAlign: "baseline"
              }}>
                /:Bridge
              </text>
            </div>

            <button class='row1' style={{
              backgroundColor: '#283593',
              color: 'white',
              fontSize: '15px',
              borderRadius: '5px',
              padding: '10px 10px',
              cursor: 'pointer',

            }} onClick={openTmyChainSite} >
              TMYChain
            </button>
          </div>

        </div>
      </header>
      <body>
      {!isConnected && (
          <div style={{
            padding: 10,
            marginTop: 10,
            borderRadius: 15,
            border: "solid",
            borderInlineColor: "#F7F8FC",
            borderBlockColor: "#F7F8FC",
            backgroundColor: "#F7F8FC",
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 15,
              marginTop: 15,
              fontSize: 25,
            }}>
              <text >
                Connect with metamask
              </text>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '15px'
            }}>


              <button style=
                {{
                  backgroundColor: '#283593',
                  color: 'white',
                  fontSize: '15px',
                  borderRadius: '5px',
                  padding: '10px 10px',
                  cursor: 'pointer',
                }} onClick={onConnect} >
                Connect
              </button>
            </div>
          </div>)}
        {isConnected &&
        <div style={{
          padding: 10,
          marginTop: 10,
          borderRadius: 15,
          border: "solid",
          borderInlineColor: "#F7F8FC",
          borderBlockColor: "#F7F8FC",
          backgroundColor: "#F7F8FC",
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
            marginTop: 15,
            fontSize: 25,
            gap: 10}}>
              <text>
                Switch transfer to 
              </text>
              <button style=
              {{
                backgroundColor: '#283593',
                color: 'white',
                fontSize: '15px',
                borderRadius: '5px',
                padding: '10px 10px',
                cursor: 'pointer',
              }} onClick={changeTransferNet}  >
              {getTransferNet}
            </button>
            </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
            marginTop: 15,
            fontSize: 25,
          }}>
            
            <text>
              Amount of Token:
            </text>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
            marginTop: 15,
            fontSize: 25,
          }} >
            <input type={"text"} style={{
              borderRadius: 10,
              width: 250,
              height: 25,
              fontSize: 16
            }} onChange={event => setTokenAmount(event.target.value)} value = {getTokenAmount}>
            </input>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
            marginTop: 15,
            fontSize: 25,
          }}>
            <text >
              Address to receive in {getCurrentTransfer} Network:
            </text>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
            marginTop: 15,
            fontSize: 25,
          }} >
            <input type={"text"} style={{
              borderRadius: 10,
              width: 410,
              height: 35,
              fontSize: 16
            }} onChange={event => setTransferAddress(event.target.value)} value= {getTransferAddress}>
            </input>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <button style=
              {{
                backgroundColor: '#283593',
                color: 'white',
                fontSize: '15px',
                borderRadius: '5px',
                padding: '10px 10px',
                cursor: 'pointer',
              }} onClick={transfer}  >
              Transfer
            </button>
          </div>
          
        </div>}
      </body>
    </div>

  );
}

export default App;
