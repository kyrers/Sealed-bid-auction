# Sealed-bid-auction-house

This project expands the challenge presented by Patrick McCorry in his second Cryptocurrency Class 2022 challenge.
The main goal was to implement a contract capable of handling deposits and withdrawals. However, it mentioned sealed bids and timed withdrawals as possible use cases. So I decided to build this simple auction house.

**This is in no way a fully secure project. This was just practice. Keep that in mind.**

With that said, here's the most important project capabilities:

- Only the Auction House owner can start an auction. There are two important deadlines set when starting an auction:
    - Auction End: the frontend only allows auctions to be between 5 and 1440 minutes[^1];
    - Open Bid Deadline: 5 minutes after the auction end;
- If there's a live auction for which the auction end has not been reached yet, users can place sealed bids. Multiple bids by the same user will be summed up[^2].
- After the auction end is reached, users have 5 minutes to open their bids:
    - If the user bid is not the highest to have been open to date, the user receives his funds;
    - If the user bid is the highest to have been open to date, the user will either win the auction or receive is funds if another user opens an higher bid.
    - Funds from sealed bids after the auction is no longer live stay in the Auction House contract.


Functionalities not implemented:
- Prizes - both setting prizes and distributing them afterwards;
- Auction history.

###### kyrers

[^1]: The contract does not validate this, meaning that the owner could start an auction with different duration values by sending a transaction directly to the contract.
[^2]: Even though bids are sealed, checking a block explorer would allow everyone to see what the value passed to the contract was.