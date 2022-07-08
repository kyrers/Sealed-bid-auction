import { ethers } from 'ethers';
import { Button, Col, Row } from "react-bootstrap";
import AuctionCard from './AuctionCard';

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
    openBidDeadlineDate: Date;
    startAuction: (_duration: number) => void;
};

function MainPanel({ auctionEnd, openBidDeadline, startAuction }: FunctionProps) {
    var currentDate = new Date();
    var auctionEndDate = new Date(ethers.BigNumber.from(auctionEnd * 1000).toNumber());
    var openBidDeadlineDate = new Date(ethers.BigNumber.from(openBidDeadline * 1000).toNumber());

    if (auctionEndDate >= currentDate) { // Within bidding period
        return <RenderCards placeBidDisabled={false} liveAuction={true} openBidDisabled={false}
            auctionEndDate={auctionEndDate} openBidDeadlineDate={openBidDeadlineDate} startAuction={(_duration) => startAuction(_duration)} />
    }

    if (auctionEndDate < currentDate && openBidDeadlineDate >= currentDate) { // Within open bid deadline
        return <RenderCards placeBidDisabled={true} liveAuction={true} openBidDisabled={false}
            auctionEndDate={auctionEndDate} openBidDeadlineDate={openBidDeadlineDate} startAuction={(_duration) => startAuction(_duration)} />
    }

    return <RenderCards placeBidDisabled={true} liveAuction={false} openBidDisabled={true}
        auctionEndDate={auctionEndDate} openBidDeadlineDate={openBidDeadlineDate} startAuction={(_duration) => startAuction(_duration)} />
}

function RenderCards({ placeBidDisabled, liveAuction, openBidDisabled, auctionEndDate, openBidDeadlineDate, startAuction }: RenderCardFunctionProps) {
    return (
        <Row className="main-panel">
            <Col sm={4}>
                <div className="card-column">
                    <div className="card custom-card">
                        <div className="card-body">
                            <h5 className="card-title">Place bid</h5>
                            <div className="card-info">
                                <Button disabled={placeBidDisabled} className="custom-button">
                                    <span>Place Bid</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
            <Col sm={4}>
                <AuctionCard liveAuction={liveAuction} auctionEndDate={auctionEndDate} openBidDeadlineDate={openBidDeadlineDate} startAuction={(duration) => startAuction(duration)} />
            </Col>
            <Col sm={4}>
                <div className="card-column">
                    <div className="card custom-card">
                        <div className="card-body">
                            <h5 className="card-title">Open Bid</h5>
                            <div className="card-info">
                                <Button disabled={openBidDisabled} className="custom-button">
                                    <span>Open Bid</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        </Row >
    );
}

export default MainPanel;