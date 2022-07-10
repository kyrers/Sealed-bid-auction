import { ethers } from 'ethers';
import { Col, Row } from "react-bootstrap";
import AuctionCard from './Cards/AuctionCard';
import OpenBidCard from './Cards/OpenBidCard';
import PlaceBidCard from './Cards/PlaceBidCard';

type FunctionProps = {
    auctionEnd: number;
    openBidDeadline: number;
    highestBid: number;
    highestBidder: string;
    startAuction: (_duration: number) => void;
    placeBid: (_bid: number) => void;
    openBid: () => void;
};

type RenderCardFunctionProps = {
    placeBidDisabled: boolean;
    liveAuction: boolean;
    openBidDisabled: boolean;
    auctionEndDate: Date;
    openBidDeadlineDate: Date;
    highestBid: number;
    highestBidder: string;
    startAuction: (_duration: number) => void;
    placeBid: (_bid: number) => void;
    openBid: () => void;
};

function MainPanel({ auctionEnd, openBidDeadline, highestBid, highestBidder, startAuction, placeBid, openBid }: FunctionProps) {
    var currentDate = new Date();
    var auctionEndDate = new Date(ethers.BigNumber.from(auctionEnd * 1000).toNumber());
    var openBidDeadlineDate = new Date(ethers.BigNumber.from(openBidDeadline * 1000).toNumber());

    if (auctionEndDate >= currentDate) { // Within bidding period
        return <RenderCards placeBidDisabled={false} liveAuction={true} openBidDisabled={false}
            auctionEndDate={auctionEndDate} openBidDeadlineDate={openBidDeadlineDate} highestBid={highestBid} highestBidder={highestBidder} 
            startAuction={(_duration) => startAuction(_duration)} placeBid={(_bid) => placeBid(_bid)} openBid={() => openBid()} />
    }

    if (auctionEndDate < currentDate && openBidDeadlineDate >= currentDate) { // Within open bid deadline
        return <RenderCards placeBidDisabled={true} liveAuction={true} openBidDisabled={false}
            auctionEndDate={auctionEndDate} openBidDeadlineDate={openBidDeadlineDate} highestBid={highestBid} highestBidder={highestBidder}
            startAuction={(_duration) => startAuction(_duration)}  placeBid={(_bid) => placeBid(_bid)} openBid={() => openBid()} />
    }

    return <RenderCards placeBidDisabled={true} liveAuction={false} openBidDisabled={true}
        auctionEndDate={auctionEndDate} openBidDeadlineDate={openBidDeadlineDate} highestBid={highestBid} highestBidder={highestBidder} 
        startAuction={(_duration) => startAuction(_duration)} placeBid={(_bid) => placeBid(_bid)} openBid={() => openBid()} />
}

function RenderCards({ placeBidDisabled, liveAuction, openBidDisabled, auctionEndDate, openBidDeadlineDate, highestBid, highestBidder, startAuction, placeBid, openBid }: RenderCardFunctionProps) {
    return (
        <Row className="main-panel">
            <Col sm={4}>
                <PlaceBidCard placeBidDisabled={placeBidDisabled} placeBid={(_bid) => placeBid(_bid)}/>
            </Col>
            <Col sm={4}>
                <AuctionCard liveAuction={liveAuction} auctionEndDate={auctionEndDate} openBidDeadlineDate={openBidDeadlineDate} highestBid={highestBid} 
                    highestBidder={highestBidder} startAuction={(duration) => startAuction(duration)} />
            </Col>
            <Col sm={4}>
                <OpenBidCard openBidDisabled={openBidDisabled} openBid={() => openBid()} />
            </Col>
        </Row >
    );
}

export default MainPanel;