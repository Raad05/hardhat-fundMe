// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint) {
        (, int answer, , , ) = priceFeed.latestRoundData();
        // ETH price in usd
        return uint(answer * 1e10);
    }

    function getConversionRates(
        uint ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint) {
        uint ethPrice = getPrice(priceFeed);
        uint ethAmountInUsd = (ethPrice * ethAmount) / 1e18;

        return ethAmountInUsd;
    }
}
