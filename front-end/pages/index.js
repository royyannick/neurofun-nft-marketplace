import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useMoralisQuery, useMoralis } from "react-moralis";
import NFTBox from "../components/NFTBox";
import networkMapping from "../constants/networkMapping.json";
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries";
import { useQuery } from "@apollo/client";

export default function Home() {
  const { isWeb3Enabled, chainId } = useMoralis();
  let chainString = chainId ? parseInt(chainId).toString() : "31337";
  //TODO: CHANGE THIS!!!
  chainString = chainString == "1" ? "5" : chainString;
  const marketplaceAddress = networkMapping[chainString].NftMarketplace[0];

  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);

  return (
    <div className="container mx-auto">
      <h1 className="px-4 py-4 text-2xl font-bold">Recently Listed</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled ? (
          loading || !listedNfts ? (
            <div>Loading... </div>
          ) : (
            listedNfts.activeItems.map((nft) => {
              return (
                <NFTBox
                  price={nft.price}
                  nftAddress={nft.nftAddress}
                  tokenId={nft.tokenId}
                  marketplaceAddress={marketplaceAddress}
                  seller={nft.seller}
                  key={`${nft.nftAddress}${nft.tokenId}`}
                />
              );
            })
          )
        ) : (
          <div>Web3 Currently Not Enabled</div>
        )}
      </div>
    </div>
  );
}
