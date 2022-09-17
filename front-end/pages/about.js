import { LinkTo, Row } from "web3uikit";
import Image from "next/image";
import bookPic from "../img/ntx-book.png";

export default function Home() {
  return (
    <Row alignItems="center" justifyItems="center">
      <div>
        <p className="py-10 text-lg text-gray-100 opacity-100">
          All NFT images were taken from NeuroTechX book:
          <br />
        </p>
        <a
          href="https://www.amazon.com/Neurotech-Primer-Beginners-Everything-Neurotechnology/dp/B09CKP1D66"
          className="py-5 opacity-100"
        >
          <Image src={bookPic} alt="NeuroTechX Book" width={407} height={612} />
        </a>
        <div>
          <p className="py-10 text-lg text-gray-100 opacity-100">
            <i>* These are not real NFTs. This is just a fun project.</i>
          </p>
        </div>
      </div>
    </Row>
  );
}
