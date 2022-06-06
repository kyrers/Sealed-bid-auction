// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
* @title Sealed Bid Auction House
* @author kyrers
* @notice Allows a live auction to accept sealed bids, for users to open them and, if done in due time, recover their deposit if they're not the winners
*/
contract AuctionHouse is Ownable {
    /*------------------------------------------------------------
                                 VARIABLES
    --------------------------------------------------------------*/
    //Mapping of all user balances
    mapping(address => uint256) public balances;

    //Mapping of users and their bid status
    mapping(address => bool) public isSealed;

    //Highest bid
    uint256 private highestBid;

    //Limit for bids
    uint256 public auctionDeadline;

    //End of auction
    uint256 public auctionEnd;

    //Highest bidder
    address private highestBidder;

    //Auction status
    bool public isAuctionLive;
    
    
    /*------------------------------------------------------------
                                 EVENTS
    --------------------------------------------------------------*/
    event BidPlaced(address _account, uint256 _amount);
    event Withdrawal(address _account, uint256 _amount);

    /*------------------------------------------------------------
                                 ERRORS
    --------------------------------------------------------------*/
    error NoFundsSent();
    error NotEnoughBalance();
    error FailedToSendFunds();

    /*------------------------------------------------------------
                                 FUNCTIONS
    --------------------------------------------------------------*/
    /**
    * @notice Empty constructor
    */
    constructor() {}

    /**
    * @notice Allows owner to start an auction
    */
    function startAuction(uint256 _end) external onlyOwner {
        
    }

    /**
    * @notice Allow user to make a bid
    * @dev If the highest bid is equal to msg.value, the older bid will stay as the highest
    */
    function placeBid() external payable {
        //Check no value sent
        if (msg.value <= 0) revert NoFundsSent();

        balances[msg.sender] = msg.value;
        
        if(msg.value > highestBid) {
            highestBid = msg.value;
            highestBidder = msg.sender;
        }

        emit BidPlaced(msg.sender, msg.value);
    }

    /**
    * @notice Allow user to withdraw
    * @param _amount Amount to withdraw
    */
    function openBid(uint256 _amount) external payable {
        //Check no value sent
        if (balances[msg.sender] < _amount) revert NotEnoughBalance();

        //Update user balance
        balances[msg.sender] -= _amount;

        //Process withdrawal
        (bool success,) = address(msg.sender).call{value: _amount}("");
        if(!success) revert FailedToSendFunds();
 
        emit Withdrawal(msg.sender, msg.value);
    }
}
