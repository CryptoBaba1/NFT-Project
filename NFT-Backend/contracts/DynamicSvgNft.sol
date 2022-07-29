// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";

contract DynamicSvgNft is ERC721 {
    uint256 public s_tokenCounter;
    string private i_lowImgUri;
    string private i_highImgUri;
    string private constant base64EncodedSvgPrefix = "data:image/svg+xml;base64,";

    constructor(string memory lowSvg, string memory highSvg) ERC721("Dyanamic SvG NFT", "DSN") {
        s_tokenCounter = 0;
    }

    function svgToImgUri(string memory Svg) public pure returns (string memory) {
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(Svg))));
        return string(abi.encodePacked(base64EncodedSvgPrefix, svgBase64Encoded));
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
    }
}
