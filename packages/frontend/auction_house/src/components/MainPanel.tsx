import React, { MouseEventHandler } from 'react';
import { Button, Col, Row } from "react-bootstrap";

type FunctionProps = {
    auctionEnd: number;
    openBidDeadline: number;
};

function MainPanel({ auctionEnd, openBidDeadline }: FunctionProps) {

    if (auctionEnd === 0 && openBidDeadline === 0) {
        return (
            <Row className="main-panel">
                <Col sm={4}>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Place bid</h5>
                            <Button active={false} className="custom-button">
                                <span>Place Bid</span>
                            </Button>
                        </div>
                    </div>
                </Col>
                <Col sm={4}>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Current Auction</h5>
                            <span>No Auction Live</span>
                            <Button active={false} className="custom-button">
                                <span>Start auction</span>
                            </Button>
                        </div>
                    </div>
                </Col>
                <Col sm={4}>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Open Bid</h5>
                            <Button active={false} className="custom-button">
                                <span>Place Bid</span>
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row >
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