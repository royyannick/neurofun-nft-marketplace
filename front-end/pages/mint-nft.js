import styles from "../styles/Home.module.css";
import { Form, useNotification, Button, Row } from "web3uikit";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import nftAbi from "../constants/NftRngIpfs.json";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import networkMapping from "../constants/networkMapping.json";
import { useEffect, useState } from "react";

export default function Home() {
  const { chainId, account, isWeb3Enabled } = useMoralis();
  let chainString = chainId ? parseInt(chainId).toString() : "31337";
  //TODO: CHANGE THIS!!!
  chainString = chainString == "1" ? "5" : chainString;
  const dispatch = useNotification();

  const { runContractFunction } = useWeb3Contract();

  const nftAddress = "0x16438e0608d6e38Ab1897262AFbC4dAE05E59996";
  const mintFee = "10000000000000000";

  async function mint() {
    const mintOptions = {
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: "requestNtf",
      msgValue: mintFee,
      params: {},
    };

    await runContractFunction({
      params: mintOptions,
      onSuccess: (tx) => handleMintSuccess,
      onError: (error) => {
        console.log(error);
      },
    });

    async function handleMintSuccess(tx) {
      console.log(tx);
      console.log("Mint Success!");
      await tx.wait(1);
      dispatch({
        type: "success",
        message: "NFT minting",
        title: "NFT minted",
        position: "topR",
      });
    }
  }

  return (
    <div className="py-16">
      <Row alignItems="center" justifyItems="center">
        <Button
          size="xl"
          onClick={mint}
          text="Mint NTF"
          theme="custom"
          customize={{
            backgroundColor: "#23B2C6",
            fontSize: 20,
            onHover: "darken",
            textColor: "#F4F4F4",
          }}
        />
      </Row>
      <Row alignItems="center" justifyItems="center">
        <div>
          <br />
          <p className="text-gray-100">
            <i>* mint fee: 0.01 ETH</i>
          </p>
        </div>
      </Row>
    </div>
  );
}
