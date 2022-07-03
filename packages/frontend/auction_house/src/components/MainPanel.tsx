import { ethers } from 'ethers';
import React, { MouseEventHandler } from 'react';
import { Button, Col, Row } from "react-bootstrap";

type FunctionProps = {
    auctionEnd: number;
    openBidDeadline: number;
    startAuction: (_duration: number) => void;
};

type RenderCardFunctionProps = {
    placeBidDisabled: boolean;
    liveAuction: boolean;
    openBidDisabled: boolean;
    auctionEndDate: Date;
    openBidDeadlinedate: Date;
    startAuction: (_duration: number) => void;
};

function MainPanel({ auctionEnd, openBidDeadline, startAuction }: FunctionProps) {
    var currentDate = new Date();
    var auctionEndDate = new Date(ethers.BigNumber.from(auctionEnd * 1000).toNumber());
    var openBidDeadlineDate = new Date(ethers.BigNumber.from(openBidDeadline * 1000).toNumber());

    if (auctionEndDate >= currentDate) { // Within bidding period
        return <RenderCards placeBidDisabled={false} liveAuction={true} openBidDisabled={false}
            auctionEndDate={auctionEndDate} openBidDeadlinedate={openBidDeadlineDate} startAuction={() => startAuction(1)} />
    }

    if (auctionEndDate < currentDate && openBidDeadlineDate >= currentDate) { // Within open bid deadline
        return <RenderCards placeBidDisabled={true} liveAuction={true} openBidDisabled={false}
            auctionEndDate={auctionEndDate} openBidDeadlinedate={openBidDeadlineDate} startAuction={() => startAuction(1)} />
    }

    return <RenderCards placeBidDisabled={true} liveAuction={false} openBidDisabled={true}
        auctionEndDate={auctionEndDate} openBidDeadlinedate={openBidDeadlineDate} startAuction={() => startAuction(1)} />
}

function RenderCards({ placeBidDisabled, liveAuction, openBidDisabled, auctionEndDate, openBidDeadlinedate, startAuction }: RenderCardFunctionProps) {
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
                                    <div className="auction-info">
                                        <div className="auction-state">
                                            <span className="circle-green" />
                                            <b>Auction Live</b>
                                        </div>
                                        <span><b>Auction End:</b> {auctionEndDate.toISOString()}</span>
                                        <span><b>Open Bid Deadline:</b> {openBidDeadlinedate.toISOString()}</span>
                                    </div>
                                    :
                                    <div className="auction-info">
                                        <div className="auction-state">
                                            <span className="circle-red" />
                                            <b>No Auction Live</b>
                                        </div>
                                    </div>
                            }
                            <Button disabled={liveAuction} className="custom-button" onClick={() => startAuction(1)}>
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