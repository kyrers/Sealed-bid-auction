import { ethers } from 'ethers';
import { useState } from 'react';
import { Button, Form, InputGroup } from "react-bootstrap";

type FunctionProps = {
    auctionCreator: string;
    liveAuction: boolean;
    auctionEndDate: Date;
    openBidDeadlineDate: Date;
    highestBid: number;
    highestBidder: string;
    startAuction: (_duration: number) => void;
};

function AuctionCard({ auctionCreator, liveAuction, auctionEndDate, openBidDeadlineDate, highestBid, highestBidder, startAuction }: FunctionProps) {
    const [formValidated, setFormValidated] = useState(false);
    const [duration, setDuration] = useState(5);

    const renderAuctionCard = () => {
        const handleSubmit = (event: any) => {
            const form = event.currentTarget;

            event.preventDefault();
            if (form.checkValidity() === false) {
                event.stopPropagation();
                setFormValidated(true);
            } else {
                startAuction(duration);
            }
        };

        return (
            <Form className="auction-form" noValidate validated={formValidated} onSubmit={handleSubmit}>
                <Form.Group className="margin-bottom-10" controlId="validation">
                    <Form.Label>Duration</Form.Label>
                    <InputGroup>
                        <Form.Control required type="number" placeholder="Duration in minutes" min="5" max="1440"
                            value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                        <InputGroup.Text id="minText">min</InputGroup.Text>
                        <Form.Control.Feedback type="invalid">Please select a value between 5 and 1440.</Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <Button type="submit" className="custom-button">
                    Start Auction
                </Button>
            </Form>
        );
    }

    return (
        <div className="card-column">
            <div className="card custom-card">
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
                                    <span><b>Creator:</b> {auctionCreator} </span>
                                    <span><b>Highest Bid:</b> {highestBid == 0 ? "No bid opened yet" : `${ethers.utils.formatEther(highestBid)} ETH` }</span>
                                    <span><b>Highest Bidder:</b> {highestBidder === ethers.constants.AddressZero ? "No bid opened yet" : highestBidder}</span>
                                    <span><b>Auction End:</b> {auctionEndDate.toUTCString()}</span>
                                    <span><b>Open Bid Deadline:</b> {openBidDeadlineDate.toUTCString()}</span>
                                </div>
                                :
                                <div className="auction-info">
                                    <div className="auction-state">
                                        <span className="circle-red" />
                                        <b>No Auction Live</b>
                                    </div>
                                    {renderAuctionCard()}
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuctionCard;