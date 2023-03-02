// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RandomIpfsNft is VRFConsumerBaseV2, ERC721 {
    // when we mint an nft, a chainlinkVRF call is triggered to get a random number
    //using that number, we will get random nft

    //user have to pay to mint an nft and
    //owner of the contract can withdraw the eth

    //type declaration
    enum Breed {
        PUG, 
        SHIBA_INU,
        ST_BERNARD
    }

    //chainlink VRF Variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gaslane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private immutable REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable NUM_WORDS = 1;

    //VRF helpers, here we are indicating the each owner who calls requestId with an address
    mapping(uint256 => address) public s_requestIdToSender;

    //VRF variables
    uint256 public s_tokenCounter;
    uint256 internal constant VALUE_MAX_CHANCE = 100;

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gaslane,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Random Ipfs Nft", "KEEN") {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_gaslane = gaslane;
        i_callbackGasLimit = callbackGasLimit;
    }

    function requestNFT() public returns (uint256 requestId) {
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gaslane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        s_requestIdToSender[requestId] = msg.sender;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        //this way chainlink node will not be owner but the one who actually called requestNFT function
        address dogOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;
        _safeMint(dogOwner, newTokenId);

        //what does this token look like?
        uint256 moddedRng = randomWords[0] % VALUE_MAX_CHANCE;
    }
    function getBreedFromModdedRng(uint256 moddedRng) public pure returns (Breed) {

    }

    function getChanceArray(uint256) public pure returns (uint256[3] memory) {
        return [10, 30, VALUE_MAX_CHANCE];
    }

    function tokenURI(uint256) public view override returns (string memory) {}
}
