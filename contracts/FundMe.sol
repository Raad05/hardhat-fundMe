// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./PriceConverter.sol";

// errors
error NotOwner();

contract FundMe {
    address public immutable i_owner;

    AggregatorV3Interface public priceFeed;

    constructor(address _priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    using PriceConverter for uint;

    // gas optimization
    uint public constant MIN_USD = 20 * 1e18;

    address[] public s_funders;
    mapping(address => uint) public s_addressToAmountFunded;

    function sendFund() public payable {
        require(
            msg.value.getConversionRates(priceFeed) >= MIN_USD,
            "Insufficient fund"
        );
        // add funder
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdrawFund() public onlyOwner {
        for (uint i = 0; i < s_funders.length; i++) {
            address funder = s_funders[i];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);

        (bool sent, ) = payable(msg.sender).call{value: address(this).balance}(
            ""
        );
        require(sent, "Failed to transact ETH");
    }

    modifier onlyOwner {
        // require(msg.sender == i_owner, "You are not the i_owner");
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _;
    }

    function cheaperWithdrawFund() public payable onlyOwner {
        address[] memory funders = s_funders;

        for(uint i = 0; i < funders.length; i++) {
            address funder = funders[i];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);
        (bool sent, ) = i_owner.call{value: address(this).balance}("");
        require(sent);
    }

    receive() external payable {
        sendFund();
    }

    fallback() external payable {
        sendFund();
    }
}
