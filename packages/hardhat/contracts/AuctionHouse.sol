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

    //Array of bidders
    address[] bidders;

    //Highest bidder
    address private highestBidder;

    //Highest bid
    uint256 private highestBid;

    //End of auction
    uint256 public auctionEnd;

    //Limit for openning bids
    uint256 public openBidDeadline;

    //Auction status
    bool public isAuctionLive;
    
    /*------------------------------------------------------------
                                 MODIFIERS
    --------------------------------------------------------------*/
    modifier noLiveAuction() {
        if (isAuctionLive) revert AuctionAlreadyLive();
        _;
    }

    modifier liveAuction() {
        if (!isAuctionLive) revert NoAuctionLive();
        _;
    }
    
    /*------------------------------------------------------------
                                 EVENTS
    --------------------------------------------------------------*/
    event BidPlaced(address _account, uint256 _amount);
    event Withdrawal(address _account, uint256 _amount);

    /*------------------------------------------------------------
                                 ERRORS
    --------------------------------------------------------------*/
    error AuctionAlreadyLive();
    error NoAuctionLive();
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
    * @param _duration Duration of the auction in minutes
    */
    function startAuction(uint256 _duration) external onlyOwner noLiveAuction {
        //Delete mappings
        resetMappings();

        //Update timestamps
        auctionEnd = block.timestamp + _duration * 1 minutes;
        openBidDeadline = auctionEnd + 5 minutes;

        //Update auction info
        isAuctionLive = true;
        highestBidder = address(0);
        highestBid = type(uint256).max;
    }

    /**
    * @notice Allow user to make a bid
    * @dev If the highest bid is equal to msg.value, the older bid will stay as the highest
    */
    /*function placeBid() external payable liveAuction {
        //Check no value sent
        if (msg.value <= 0) revert NoFundsSent();

        //Update user balance
        balances[msg.sender] = msg.value;
        
        //Check if highest bid
        if(msg.value > highestBid) {
            highestBid = msg.value;
            highestBidder = msg.sender;
        }

        emit BidPlaced(msg.sender, msg.value);
    }*/

    /**
    * @notice Allow user to withdraw
    * @param _amount Amount to withdraw
    */
    /*function openBid(uint256 _amount) external payable {
        //Check no value sent
        if (balances[msg.sender] < _amount) revert NotEnoughBalance();

        //Update user balance
        balances[msg.sender] -= _amount;

        //Process withdrawal
        (bool success,) = address(msg.sender).call{value: _amount}("");
        if(!success) revert FailedToSendFunds();
 
        emit Withdrawal(msg.sender, msg.value);
    }*/

    /**
    * @notice Reset mappings and bidders array upon new auction start
    */
    function resetMappings() internal {
        for (uint i=0; i< bidders.length ; i++){
            delete balances[bidders[i]];
            delete isSealed[bidders[i]];
        }

        delete bidders;
    }
}
