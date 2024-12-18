// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FixedDeposit {
    address public bank; // Address of the bank deploying the contract
    address public seller; // Address of the seller (initial depositor)
    address public buyer; // Address of the buyer (new owner)

    uint256 public principal = 100; // Fixed deposit principal in dollars
    uint256 public interestRate = 5; // Simple interest rate in percent
    uint256 public tenure = 5; // Tenure in years

    uint256 public maturityAmount; // Amount payable at maturity
    bool public isTransferred = false; // Indicates if ownership is transferred

    event DepositInitialized(address indexed bank, address indexed seller, uint256 principal);
    event OwnershipTransferred(address indexed seller, address indexed buyer, uint256 transferAmount);

    modifier onlyBank() {
        require(msg.sender == bank, "Only the bank can perform this action");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only the seller can perform this action");
        _;
    }

    constructor(address _seller) {
        bank = msg.sender;
        seller = _seller;
        maturityAmount = principal + (principal * interestRate * tenure) / 100;

        emit DepositInitialized(bank, seller, principal);
    }

    function transferOwnership(address _buyer) external onlySeller {
        require(!isTransferred, "Ownership has already been transferred");
        require(_buyer != address(0), "Invalid buyer address");

        buyer = _buyer;
        isTransferred = true;

        emit OwnershipTransferred(seller, buyer, 95);
    }

    function getDetails() external view returns (
        address _bank,
        address _seller,
        address _buyer,
        uint256 _principal,
        uint256 _interestRate,
        uint256 _tenure,
        uint256 _maturityAmount,
        bool _isTransferred
    ) {
        return (
            bank,
            seller,
            buyer,
            principal,
            interestRate,
            tenure,
            maturityAmount,
            isTransferred
        );
    }
}
