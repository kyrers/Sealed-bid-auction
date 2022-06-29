import React, { MouseEventHandler } from 'react';
import { Button } from "react-bootstrap";

type FunctionProps = {
    auctionEnd: number;
    openBidDeadline: number;
};

function MainPanel({ auctionEnd, openBidDeadline }: FunctionProps) {

    if (auctionEnd === 0 && openBidDeadline === 0) {
        return (
            <div className="main-panel">
                <span>No Auction Live</span>
            </div>
        );
    }
    return (
        <div className="main-panel">
            <span>Auction Live</span>
            <span>Auction End: {new Date(auctionEnd).toLocaleString()}</span>
            <span>Open Bid Deadline {new Date(openBidDeadline).toLocaleString()}</span>
        </div>
    );
}

export default MainPanel;