import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Head from "next/head";
import { NotificationProvider } from "web3uikit";

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/34534/nick-nft-marketplace/v0.0.2",
});

function NFTMarketplace({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>NeuroFunTrade</title>
        <meta name="description" content="NeuroFunTrade - NFT Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <ApolloProvider client={client}>
          <NotificationProvider>
            <Header />
            <Component {...pageProps} />
            <Footer />
          </NotificationProvider>
        </ApolloProvider>
      </MoralisProvider>
    </div>
  );
}

export default NFTMarketplace;
