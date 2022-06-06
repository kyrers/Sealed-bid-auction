// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.14;

/**
* @title SealedBid 
* @author kyrers
* @notice Allows users to make a sealed bid, open it and, if done in due time, recover their deposit if they're not the winners
*/
contract SealedBid {
    /*------------------------------------------------------------
                                 VARIABLES
    --------------------------------------------------------------*/
    //Mapping of all user balances
    mapping(address => uint256) public balances;
    
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
    * @notice Allow user to make a bid
    */
    function placeBid() external payable {
        //Check no value sent
        if (msg.value <= 0) revert NoFundsSent();

        balances[msg.sender] = msg.value;
        emit BidPlaced(msg.sender, msg.value);
    }

    /**
    * @notice Allow user to withdraw
    * @param _amount Amount to withdraw
    */
    function withdraw(uint256 _amount) external payable {
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
