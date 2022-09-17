//import { ConnectButton } from "web3uikit";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-row items-center justify-between py-10 border-t-2">
      <div className="p-2 ml-4">
        <i>
          This is an educational project on a testnet - never to be deployed on
          mainnet!
        </i>
      </div>
      <Link href="https://yroy.me">
        <a className="p-2 mr-4">Yannick Roy</a>
      </Link>
    </footer>
  );
}
