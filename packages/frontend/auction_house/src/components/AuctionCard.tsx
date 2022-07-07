import { useState } from 'react';
import { Button, Form, InputGroup } from "react-bootstrap";

type FunctionProps = {
    liveAuction: boolean;
    auctionEndDate: Date;
    openBidDeadlineDate: Date;
    startAuction: (_duration: number) => void;
};

function AuctionCard({ liveAuction, auctionEndDate, openBidDeadlineDate, startAuction }: FunctionProps) {
    const [formValidated, setFormValidated] = useState(false);
    const [duration, setDuration] = useState(5);

    const renderAuctionCard = () => {
        const handleSubmit = (event: any) => {
            const form = event.currentTarget;
            console.log("DURATION: ", duration);

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
                        <Form.Control.Feedback type="invalid">Please select a value between 5 and 1440.</Form.Control.Feedback>
                        <InputGroup.Text id="minText">min</InputGroup.Text>
                    </InputGroup>
                </Form.Group>

                <Button type="submit" className="custom-button">
                    Start Auction
                </Button>
            </Form>
        );
    }

    return (
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
    );
}

export default AuctionCard;