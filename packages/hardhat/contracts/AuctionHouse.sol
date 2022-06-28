// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

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

    mapping(address => uint256) private bids;
    
    address[] public bidders;
    address public highestBidder;

    uint256 public highestBid;
    //End of auction
    uint256 public auctionEnd;
    //Limit for opening bids
    uint256 public openBidDeadline;
    
    /*------------------------------------------------------------
                                 MODIFIERS
    --------------------------------------------------------------*/
    modifier noLiveAuction() {
        if (block.timestamp <= openBidDeadline) revert AuctionAlreadyLive();
        _;
    }

    modifier liveAuction() {
        if (block.timestamp > auctionEnd) revert NoAuctionLive();
        _;
    }

    modifier isWithinOpeningPeriod() {
        if(block.timestamp <= auctionEnd || block.timestamp > openBidDeadline) revert OutsideBidOpeningPeriod();
        _;
    }
    
    /*------------------------------------------------------------
                                 EVENTS
    --------------------------------------------------------------*/
    event AuctionStarted(uint256 _auctionEnd, uint256 _openBidDeadline);
    event BidPlaced(address _account);
    event Withdrawal(address _account, uint256 _amount);

    /*------------------------------------------------------------
                                 ERRORS
    --------------------------------------------------------------*/
    error AuctionAlreadyLive();
    error NoAuctionLive();
    error OutsideBidOpeningPeriod();
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
        highestBidder = address(0);
        highestBid = type(uint256).min;

        emit AuctionStarted(auctionEnd, openBidDeadline);
    }

    /**
    * @notice Allow user to make a bid
    */
    function placeBid() external payable liveAuction {
        //Check no value sent
        if (msg.value <= 0) revert NoFundsSent();

        //Update user bid and bidders array
        bids[msg.sender] += msg.value;
        bidders.push(msg.sender);
        
        emit BidPlaced(msg.sender);
    }

    /**
    * @notice Allow user to open the bid and recover funds if done in time and not the highest bidder
    * @dev If the highest bid is equal to msg.value, the older bid will stay as the highest
    */
    function openBid() external isWithinOpeningPeriod {
        uint256 bidValue = bids[msg.sender];

        //Check no bid made
        if (bidValue <= 0) revert NotEnoughBalance();

        //Check if highest bid
        if(bidValue > highestBid) {
            uint256 previousHighestBid = highestBid;
            address previousHighestBidder = highestBidder;

            //Update previous highest bidder user balance
            bids[previousHighestBidder] = 0;

            highestBid = bidValue;
            highestBidder = msg.sender;

            //Process withdrawal to dethroned highest bidder
            if(previousHighestBidder != address(0)) {
                (bool success,) = address(previousHighestBidder).call{value: previousHighestBid}("");
                if(!success) revert FailedToSendFunds();

                emit Withdrawal(previousHighestBidder, previousHighestBid);
            }
        } else {
            //Update user balance
            bids[msg.sender] = 0;

            //Process withdrawal
            (bool success,) = address(msg.sender).call{value: bidValue}("");
            if(!success) revert FailedToSendFunds();
 
            emit Withdrawal(msg.sender, bidValue);
        }
    }

    /**
    * @notice Reset mappings and bidders array upon new auction start
    */
    function resetMappings() private {
        for (uint i=0; i< bidders.length ; i++){
            delete bids[bidders[i]];
        }

        delete bidders;
    }
}
