import React, { MouseEventHandler } from 'react';
import { Button, Col, Row } from "react-bootstrap";

type FunctionProps = {
    auctionEnd: number;
    openBidDeadline: number;
};

type RenderCardFunctionProps = {
    placeBidDisabled: boolean;
    liveAuction: boolean;
    openBidDisabled: boolean;
};

function MainPanel({ auctionEnd, openBidDeadline }: FunctionProps) {
    var currentDate = new Date().getTime();

    //if (auctionEnd < currentDate && openBidDeadline < currentDate) { // No auction live
    if (auctionEnd >= currentDate) { // Within bidding period
        return <RenderCards placeBidDisabled={true} liveAuction={true} openBidDisabled={true} />
    }

    if (auctionEnd < currentDate && openBidDeadline >= currentDate) { // Within open bid deadline
        return <RenderCards placeBidDisabled={false} liveAuction={true} openBidDisabled={true} />
    }

    return <RenderCards placeBidDisabled={true} liveAuction={false} openBidDisabled={true} />
}

function RenderCards({ placeBidDisabled, liveAuction, openBidDisabled }: RenderCardFunctionProps) {
    return (
        <Row className="main-panel">
            <Col sm={4}>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Place bid</h5>
                        <div className="card-info">
                            <Button disabled={placeBidDisabled} className="custom-button">
                                <span>Place Bid</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </Col>
            <Col sm={4}>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Current Auction</h5>
                        <div className="card-info">
                            {
                                liveAuction ?

                                    <span> Auction Live</span>
                                    :
                                    <span>No Auction Live</span>
                            }
                            <Button disabled={liveAuction} className="custom-button">
                                <span>Start auction</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </Col>
            <Col sm={4}>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Open Bid</h5>
                        <div className="card-info">
                            <Button disabled={openBidDisabled} className="custom-button">
                                <span>Open Bid</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </Col>
        </Row >
    );
}
/*return (
    <div className="main-panel">
        <span>Auction Live</span>
        <span>Auction End: {new Date(auctionEnd).toLocaleString()}</span>
        <span>Open Bid Deadline {new Date(openBidDeadline).toLocaleString()}</span>
    </div>
);*/

export default MainPanel;