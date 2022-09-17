import { ConnectButton } from "web3uikit";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="flex flex-row items-center justify-between p-5 border-b-2">
      <h1 className="px-4 py-4 text-3xl font-bold">NeuroFunTrade</h1>
      <div className="flex flex-row items-center">
        <Link href="/">
          <a className="p-6 mr-4">NFT Marketplace</a>
        </Link>
        <Link href="/mint-nft">
          <a className="p-6 mr-4">Mint NFT</a>
        </Link>
        <Link href="/sell-nft">
          <a className="p-6 mr-4">Sell NFT</a>
        </Link>
        <Link href="/about">
          <a className="p-6 mr-4">About</a>
        </Link>
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
}
