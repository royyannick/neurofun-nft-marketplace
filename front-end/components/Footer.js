import { ConnectButton } from "web3uikit";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="footer">
      This is an educational project on a testnet - never to be deployed on
      mainnet! <br />
      Made by:
      <Link href="https://yroy.me">
        <a className="p-6 mr-4">Yannick Roy</a>
      </Link>
      <button className="top-connect button">Test Button</button>
    </div>
  );
}
