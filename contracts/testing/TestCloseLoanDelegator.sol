pragma solidity 0.4.23;
pragma experimental "v0.5.0";

import { CloseLoanDelegator } from "../margin/interfaces/CloseLoanDelegator.sol";
import { OnlyMargin } from "../margin/interfaces/OnlyMargin.sol";


contract TestCloseLoanDelegator is OnlyMargin, CloseLoanDelegator {

    uint256 public AMOUNT_TO_RETURN;

    constructor(
        address margin,
        uint256 amountToReturn
    )
        public
        OnlyMargin(margin)
    {
        AMOUNT_TO_RETURN = amountToReturn;
    }

    function receiveLoanOwnership(
        address,
        bytes32
    )
        onlyMargin
        external
        returns (address)
    {
        return address(this);
    }

    function closeLoanOnBehalfOf(
        address,
        address,
        bytes32,
        uint256
    )
        onlyMargin
        external
        returns (uint256)
    {
        return AMOUNT_TO_RETURN;
    }

    function marginLoanIncreased(
        address,
        bytes32,
        uint256
    )
        onlyMargin
        external
        returns (bool)
    {
        return false;
    }
}