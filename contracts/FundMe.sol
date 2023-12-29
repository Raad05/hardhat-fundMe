// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./PriceConverter.sol";

// errors
error NotOwner();

contract FundMe {
    address public immutable i_owner;

    constructor() {
        i_owner = msg.sender;
    }

    using PriceConverter for uint;

    // gas optimization
    uint public constant MIN_USD = 20 * 1e18;

    address[] public funders;
    mapping(address => uint) public addressToAmountFunded;

    function sendFund() public payable {
        require(msg.value.getConversionRates() > MIN_USD, "Insufficient fund");
        // add funder
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdrawFund() public onlyOwner {
        for (uint i = 0; i < funders.length; i++) {
            address funder = funders[i];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);

        (bool sent, ) = payable(msg.sender).call{value: address(this).balance}(
            ""
        );
        require(sent, "Failed to transact ETH");
    }

    modifier onlyOwner() {
        // require(msg.sender == i_owner, "You are not the i_owner");
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _;
    }

    receive() external payable {
        sendFund();
    }

    fallback() external payable {
        sendFund();
    }
}
