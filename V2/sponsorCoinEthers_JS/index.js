//const defaultContractAddress = "0x925195d664A8CAdA8Ff90a8948e394B9bd15237B";
const spCoinContractAddress = "0x334710ABc2Efcc3DF2AfdA839bF8d0dA923dB36A";
var defaultWallet = "METAMASK";
var wallet;
var provider;
var signer;
var contractAddress = spCoinContractAddress;
var accountAddress;
var contract;

function connectMetaMask() {
  try {
    // MetaMask requires requesting permission to connect users accounts
    provider = new ethers.providers.Web3Provider(window.ethereum);
    document.getElementById("connectWallet_TX").value = "Connected to MetaMask";
  } catch (err) {
    throw err;
  }
  return provider;
}

function getWallet() {
  try {
    if (wallet == null) {
      wallet = defaultWallet;
    }
  } catch (err) {
    alert(err.message);
    throw err;
  }
  return wallet;
}

function getContract() {
  console.log("getContract");
  try {
    if (contract == null) {
		contract = new ethers.Contract(contractAddress, spCoinABI, getSigner());
    }
  } catch (err) {
    alert(err.message);
    throw err;
  }
  return contract;
}

function getWalletProvider(_wallet) {
  try {
    switch (_wallet) {
      case "METAMASK":
        provider = connectMetaMask();
        break;
      default:
        provider = connectMetaMask();
        break;
    }
  } catch (err) {
    alert(err.message);
    throw err;
  }
  return provider;
}

function getProvider() {
  try {
    if (provider == null) {
      provider = getWalletProvider(getWallet());
      changeElementIdColor("connectWallet_BTN", "green");
    }
  } catch (err) {
    alert(err.message);
    throw err;
  }
  return provider;
}

function getSigner() {
  try {
    if (signer == null) {
      signer = getProvider().getSigner();
    }
  } catch (err) {
    alert(err.message);
    throw err;
  }
  return signer;
}

// 1. Connect Metamask with Dapp
async function connectWallet() {
  try {
    // MetaMask requires requesting permission to connect users accounts
    var wallet = document.getElementById("connectWallet_TX").value;
    provider = getWalletProvider(wallet);

    /*
    await getProvider().send("eth_requestAccounts", []);
    signer = await getSigner();
    
 	*/
    changeElementIdColor("connectWallet_BTN", "green");
  } catch (err) {
  }
}

// 2. Connect Metamask Account
async function getActiveMetaMaskAccount() {
  try {
    // MetaMask requires requesting permission to connect users accounts
    accountAddress = await getSigner().getAddress();
    document.getElementById("activeMetaMaskAccount_TX").value = accountAddress;
    console.log("Account address s:", accountAddress);
    changeElementIdColor("activeMetaMaskAccount_BTN", "green");
  } catch (err) {
    alertLogError(err, "activeMetaMaskAccount_BTN");
  }
}

// 3. Get Ethereum balance
async function getEthereumAccountBalance() {
  try {
    const balance = await getSigner().getBalance();
    const convertToEth = 1e18;
    const ethbalance = balance.toString() / convertToEth;
    document.getElementById("ethereumAccountBalance_TX").value = ethbalance;
    console.log(
      "account's balance in ether:",
      balance.toString() / convertToEth
    );
    changeElementIdColor("ethereumAccountBalance_BTN", "green");
  } catch (err) {
    alertLogError(err, "ethereumAccountBalance_BTN");
  }
}

// 4. Connect contract
async function connectContract() {
	try {
	  contractText = document.getElementById("connectContract_TX");
	  contractAddress = contractText.value;
	  contract = new ethers.Contract(contractAddress, spCoinABI, getSigner());
	  // do a test call to see if contract is valid.
	  tokenName = await contract.name();
	  changeElementIdColor("connectContract_BTN", "green");
	} catch (err) {
		console.log(err);
	  contract = null;
	  if (contractAddress == null || contractAddress.length == 0)
		msg = "Error: Contract Address required";
	  else msg = "Error: Invalid Contract Address " + contractAddress;
	  alertLogError(
		{ name: "Bad Contract Address", message: msg },
		"connectContract_BTN"
	  );
	  throw err;
	}
	return contract;
  }
  
  async function connectContract() {
  try {
    contractText = document.getElementById("connectContract_TX");
    contractAddress = contractText.value;
    contract = new ethers.Contract(contractAddress, spCoinABI, getSigner());
    // do a test call to see if contract is valid.
    tokenName = await contract.name();
    changeElementIdColor("connectContract_BTN", "green");
  } catch (err) {
	  console.log(err);
    contract = null;
    if (contractAddress == null || contractAddress.length == 0)
      msg = "Error: Contract Address required";
    else msg = "Error: Invalid Contract Address " + contractAddress;
    alertLogError(
      { name: "Bad Contract Address", message: msg },
      "connectContract_BTN"
    );
	throw err;
  }
  return contract;
}

// 5. Read contract data from the contract on the connected account
/*
async function readContractData() {
  try {
    tokenName = await contract.name();
    document.getElementById("contractName_TX").value = tokenName;
    symbol = await contract.symbol();
    document.getElementById("contractSymbol_TX").value = symbol;

    // decimals = await contract.decimals()
    // alert("spCoinDecimals = "+decimals);
    spCoinTotalSupply = await contract.totalSupply();
    document.getElementById("contractTotalSupply_TX").value = spCoinTotalSupply;
    changeElementIdColor("contractData_BTN", "green");
  } catch (err) {
        alertLogError(err,"contractData_BTN");
  }
}
*/

async function readContractName() {
  try {
    tokenName = await getContract().name();
    document.getElementById("contractName_TX").value = tokenName;
    changeElementIdColor("contractName_BTN", "green");
  } catch (err) {
    console.log(err);
    if (contract == null || contract.length == 0)
      msg = "Error: Null/Empty Contract";
    else msg = "Error: readContractName() ";
    alertLogError(
      { name: "ReadNameFailure", message: msg },
      "contractName_BTN"
    );
  }
}

async function readContractSymbol() {
  try {
    symbol = await getContract().symbol();
    document.getElementById("contractSymbol_TX").value = symbol;
    changeElementIdColor("contractSymbol_BTN", "green");
  } catch (err) {
    console.log(err);
    if (contract == null || contract.length == 0)
      msg = "Error: Null/Empty Contract";
    else msg = "Error: readContracSymbol() ";
    alertLogError(
      { name: "readContracSymbol", message: msg },
      "contractSymbol_BTN"
    );
  }
}

async function readContractTotalSupply() {
  try {
    spCoinTotalSupply = await getContract().totalSupply();
    document.getElementById("contractTotalSupply_TX").value = spCoinTotalSupply;
    changeElementIdColor("contractTotalSupply_BTN", "green");
  } catch (err) {
    console.log(err);
    if (contract == null || contract.length == 0)
      msg = "Error: Null/Empty Contract";
    else msg = "Error: readContractTotalSupply() ";
    alertLogError(
      { name: "readContractTotalSupply", message: msg },
      "contractTotalSupply_BTN"
    );
  }
}

async function readContractDecimals() {
  try {
    decimals = await getContract().decimals();
    document.getElementById("contractDecimals_TX").value = decimals;
    changeElementIdColor("contractDecimals_BTN", "green");
  } catch (err) {
    console.log(err);
    if (contract == null || contract.length == 0)
      msg = "Error: Null/Empty Contract";
    else msg = "Error: readContractDecimals() ";
    alertLogError(
      { name: "readContractDecimals", message: msg },
      "contractDecimals_BTN"
    );
  }
}

async function balanceOf() {
  try {
    balance = await getContract().balanceOf(accountAddress);
    document.getElementById("balanceOf_TX").value = balance;
    console.log("balanceOf " + accountAddress + " = " + balance);
    changeElementIdColor("balanceOf_BTN", "green");
  } catch (err) {
    console.log(err);
	alert(contract)
    if (contract == null || contract.length == 0)
      msg = "Error: Null/Empty Contract";
    else msg = "Error: readContractBalanceOfName() ";
    alertLogError(
      { name: "GetBalanceOfNameFailure", message: msg },
      "balanceOf_BTN"
    );
  }
}

async function sendToAccount() {
  try {
    const spCoinContract = new ethers.Contract(
      contractAddress,
      spCoinABI,
      getProvider()
    );
    sendToAccountAddr = document.getElementById("sendToAccountAddr_TX");
    addr = document.getElementById("sendToAccountAddr_TX").value;
    if (!addr && addr.length == 0) {
      console.log("Address is empty");
      sendToAccountAddr.value = "Address is empty";
      changeElementIdColor("sendToAccountAddr_TX", "red");
      changeElementIdColor("sendToAccount_BTN", "red");
    } else {
      if (!ethers.utils.isAddress(addr)) {
        alert("Address %s is not valid", addr);
        changeElementIdColor("sendToAccountAddr_TX", "red");
        changeElementIdColor("sendToAccount_BTN", "red");
      } else {
        spCoinContract.connect(signer).transfer(addr, "500000000");
        changeElementIdColor("sendToAccount_BTN", "green");
      }
    }
  } catch (err) {
    alertLogError(err, "sendToAccount_BTN");
  }
}

function alertLogError(err, element) {
  console.log(err.message);
  changeElementIdColor(element, "red");
  alert(err.message);
}

function changeElementIdColor(name, color) {
  document.getElementById(name).style.backgroundColor = color;
}

function toggle(elmtStr) {
  elmtObj = document.getElementById(elmtStr);
  if (elmtObj.style.display === "none") {
    elmtObj.style.display = "block";
  } else {
    elmtObj.style.display = "none";
  }
}

function isEmptyObj(object) {
  isEmpty = JSON.stringify(object) === "{}";
  return isEmpty;
}
