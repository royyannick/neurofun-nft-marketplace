// SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error RandomIpfsNft__RangeOutOfBount();
error RandomIpfsNft__NeedMoreETHSent();
error RandomIpfsNft__TransferFailed();

contract NftRngIpfs is VRFConsumerBaseV2, ERC721URIStorage, Ownable {
    enum NeuroTech {
        DBS,
        TMS,
        tDCS,
        EEG
    }
    uint16 public constant NB_NEUROTECH = 4;
    //Order: DBS, TMS, tDCS, EEG

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // VRF Helpers
    mapping(uint256 => address) private s_requestIdToSender;

    // NFT Variables
    uint256 private s_tokenCounter;
    uint256 internal constant MAX_CHANCE_VALUE = 100;
    string[] internal s_neuroTokenUris;
    uint256 internal immutable i_mintFee;

    // Events
    event NftRequested(uint256 indexed requestId, address requester);
    event NftMinted(NeuroTech tech, address neuroOwner);

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit,
        string[NB_NEUROTECH] memory neuroTokenUris,
        uint256 mintFee
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("NeuroFunTrade", "NF") {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;
        s_tokenCounter = 0;
        s_neuroTokenUris = neuroTokenUris;
        i_mintFee = mintFee;
    }

    function requestNtf() public payable returns (uint256 requestId) {
        console.log("Requesting NTF...");
        if (msg.value < i_mintFee) {
            revert RandomIpfsNft__NeedMoreETHSent();
        }
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requestIdToSender[requestId] = msg.sender;

        console.log("NTF Requested!");
        emit NftRequested(requestId, msg.sender);
    }

    function fulfillRandomWords(uint256 requestID, uint256[] memory randomWords)
        internal
        override
    {
        address neuroOwner = s_requestIdToSender[requestID];
        uint256 newTokenID = s_tokenCounter;

        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;

        NeuroTech tech = getNTFromRNG(moddedRng);
        s_tokenCounter = s_tokenCounter + 1;
        _safeMint(neuroOwner, newTokenID);
        _setTokenURI(newTokenID, s_neuroTokenUris[uint256(tech)]);

        console.log("NTF Requested!");
        emit NftMinted(tech, msg.sender);
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert RandomIpfsNft__TransferFailed();
        }
    }

    function getNTFromRNG(uint256 moddedRng) public pure returns (NeuroTech) {
        uint256 cumulativeSum = 0;
        uint256[NB_NEUROTECH] memory chanceArray = getChanceArray();
        for (uint256 i = 0; i < chanceArray.length; i++) {
            if (
                moddedRng >= cumulativeSum &&
                moddedRng < cumulativeSum + chanceArray[i]
            ) {
                return NeuroTech(i);
            }
            cumulativeSum += chanceArray[i];
        }

        revert RandomIpfsNft__RangeOutOfBount();
    }

    function getChanceArray()
        public
        pure
        returns (uint256[NB_NEUROTECH] memory)
    {
        //Order: DBS, TMS, tDCS, EEG
        return [5, 20, 30, uint256(45)];
    }

    function getNTTokenUris(uint256 index) public view returns (string memory) {
        return s_neuroTokenUris[index];
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }
}
