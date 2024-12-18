import React, { useState } from "react";
import MyGroup from "./components/MyGroup.jsx";
import walletConnectFcn from "./components/hedera/walletConnect.js";
import tokenCreateFcn from "./components/hedera/tokenCreate.js";
import tokenMintFcn from "./components/hedera/tokenMint.js";
import contractDeployFcn from "./components/hedera/contractDeploy.js";
import contractExecuteFcn from "./components/hedera/contractExecute.js";
import "./styles/App.css";


function App() {
	
	const [sellerWalletData, setSellerWalletData] = useState();
	const [buyerWalletData, setBuyerWalletData] = useState();
	const [bankWalletData, setBankWalletData] = useState();
	
	const [sellerAccountId, setSellerAccountId] = useState();
	const [buyerAccountId, setBuyerAccountId] = useState();
	const [bankAccountId, setBankAccountId] = useState();

	const [tokenId, setTokenId] = useState();
	const [tokenSupply, setTokenSupply] = useState();
	const [contractId, setContractId] = useState();

	const [bankconnectTextSt, setbankConnectTextSt] = useState("");
	const [bankconnectLinkSt, setbankConnectLinkSt] = useState("");
	const [bankcreateTextSt, setbankCreateTextSt] = useState("");

	const [sellerconnectTextSt, setsellerConnectTextSt] = useState("");
	const [sellerconnectLinkSt, setsellerConnectLinkSt] = useState("");
	const [sellercreateTextSt, setsellerCreateTextSt] = useState("");

	const [buyerconnectTextSt, setbuyerConnectTextSt] = useState("");
	const [buyerconnectLinkSt, setbuyerConnectLinkSt] = useState("");
	const [buyercreateTextSt, setbuyerCreateTextSt] = useState("");

	const [mintTextSt, setMintTextSt] = useState("");
	const [contractTextSt, setContractTextSt] = useState();
	const [transferTextSt, setTransferTextSt] = useState();


	const [createLinkSt, setCreateLinkSt] = useState("");
	const [mintLinkSt, setMintLinkSt] = useState("");
	const [contractLinkSt, setContractLinkSt] = useState();
	const [transferLinkSt, setTransferLinkSt] = useState();

	const { Client } = require("@hashgraph/sdk");
	require("dotenv").config();
	
	const client = Client.forTestnet();
	client.setOperator(process.env.HEDERA_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);
	
	console.log("Connected to Hedera Testnet!");


	async function bankconnectWallet() {
		if (bankAccountId !== undefined) {
			setbankConnectTextSt(`🔌 Account ${bankAccountId} already connected ⚡ ✅`);
		} else {
			const wData = await walletConnectFcn();
			wData[0].pairingEvent.once((pairingData) => {
				pairingData.accountIds.forEach((id) => {
					setBankAccountId(id);
					console.log(`- Paired account id: ${id}`);
					setbankConnectTextSt(`🔌 Account ${id} connected ⚡ ✅`);
					setbankConnectLinkSt(`https://hashscan.io/testnet/account/${id}`);
				});
			});
			setBankWalletData(wData);
			setbankCreateTextSt();
		}
	}

	async function sellerconnectWallet() {
		if (sellerAccountId !== undefined) {
			setsellerConnectTextSt(`🔌 Account ${sellerAccountId} already connected ⚡ ✅`);
		} else {
			const wData = await walletConnectFcn();
			wData[0].pairingEvent.once((pairingData) => {
				pairingData.accountIds.forEach((id) => {
					setSellerAccountId(id);
					console.log(`- Paired account id: ${id}`);
					setsellerConnectTextSt(`🔌 Account ${id} connected ⚡ ✅`);
					setsellerConnectLinkSt(`https://hashscan.io/testnet/account/${id}`);
				});
			});
			setSellerWalletData(wData);
			setsellerCreateTextSt();
		}
	}

	async function buyerconnectWallet() {
		if (buyerAccountId !== undefined) {
			setbuyerConnectTextSt(`🔌 Account ${buyerAccountId} already connected ⚡ ✅`);
		} else {
			const wData = await walletConnectFcn();
			wData[0].pairingEvent.once((pairingData) => {
				pairingData.accountIds.forEach((id) => {
					setBuyerAccountId(id);
					console.log(`- Paired account id: ${id}`);
					setbuyerConnectTextSt(`🔌 Account ${id} connected ⚡ ✅`);
					setbuyerConnectLinkSt(`https://hashscan.io/testnet/account/${id}`);
				});
			});
			setBuyerWalletData(wData);
			setbuyerCreateTextSt();
		}
	}


	async function tokenCreate() {
		if (tokenId !== undefined) {
			setbankCreateTextSt(`You already have token ${tokenId} ✅`);
		} else if (bankAccountId === undefined) {
			setbankCreateTextSt(`🛑 Connect a wallet first! 🛑`);
		} else {
			const [tId, tokenSupply, txIdRaw] = await tokenCreateFcn(bankWalletData, bankAccountId);
			setTokenId(tId);
			setTokenSupply(tokenSupply);
			setbankCreateTextSt(`Successfully created token with ID: ${tId} ✅`);
			setMintTextSt();
			setContractTextSt();
			setTransferTextSt();
			const txId = prettify(txIdRaw);
			setCreateLinkSt(`https://hashscan.io/testnet/transaction/${txId}`);
		}
	}

	async function contractDeploy() {
		if (tokenId === undefined) {
			setContractTextSt("🛑 Create a token first! 🛑");
		} else if (contractId !== undefined) {
			setContractTextSt(`You already have contract ${contractId} ✅`);
		} else {
			const [cId, txIdRaw] = await contractDeployFcn(sellerWalletData, sellerAccountId, tokenId);
			setContractId(cId);
			setContractTextSt(`Successfully deployed smart contract with ID: ${cId} ✅`);
			setTransferTextSt();
			const txId = prettify(txIdRaw);
			setContractLinkSt(`https://hashscan.io/testnet/transaction/${txId}`);
		}
	}

	async function contractExecute() {
		if (tokenId === undefined || contractId === undefined) {
			setTransferTextSt("🛑 Create a token AND deploy a contract first! 🛑");
		} else {
			const txIdRaw = await contractExecuteFcn(sellerWalletData, sellerAccountId, tokenId, contractId);
			setTransferTextSt(`🎉🎉🎉 Payment successful 🎉🎉🎉`);
			const txId = prettify(txIdRaw);
			setTransferLinkSt(`https://hashscan.io/testnet/transaction/${txId}`);
		}
	}

	function prettify(txIdRaw) {
		const a = txIdRaw.split("@");
		const b = a[1].split(".");
		return `${a[0]}-${b[0]}-${b[1]}`;
	}


	return (
		<div className="App">
			<h1 className="header">Transforming liquidity of fixed deposits</h1>
			
			<h1 className="sub-text">for the bank</h1>
			<MyGroup
				fcn={bankconnectWallet}
				buttonLabel={"Connect Wallet"}
				text={bankconnectTextSt}
				link={bankconnectLinkSt}
			/>

			<MyGroup
				fcn={tokenCreate}
				buttonLabel={"Create New Token"}
				text={bankcreateTextSt}
				link={createLinkSt}
			/>

			<MyGroup
				fcn={contractDeploy}
				buttonLabel={"Deploy Contract"}
				text={contractTextSt}
				link={contractLinkSt}
			/>

			<h1 className="sub-text">for owner of the FD</h1>

			<MyGroup
				fcn={sellerconnectWallet}
				buttonLabel={"Connect Wallet"}
				text={sellerconnectTextSt}
				link={sellerconnectLinkSt}
			/>

			<h1 className="sub-text">for buyer of the FD</h1>

			<MyGroup
				fcn={buyerconnectWallet}
				buttonLabel={"Connect Wallet"}
				text={buyerconnectTextSt}
				link={buyerconnectLinkSt}
			/>

			<MyGroup
				fcn={contractExecute}
				buttonLabel={"Transfer Tokens"}
				text={transferTextSt}
				link={transferLinkSt}
			/>

			<div className="logo">
				<span>FlexD</span>
			</div>
		</div>
	);
}
export default App;
