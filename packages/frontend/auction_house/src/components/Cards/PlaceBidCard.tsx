import { useState } from 'react';
import { Button, Form, InputGroup } from "react-bootstrap";

type FunctionProps = {
    placeBidDisabled: boolean
    placeBid: (_bid: number) => void;
};

function PlaceBidCard({ placeBidDisabled, placeBid }: FunctionProps) {
    const [formValidated, setFormValidated] = useState(false);
    const [bid, setBid] = useState("0.50");

    const renderPlaceBidCard = () => {
        const handleSubmit = (event: any) => {
            const value = Number.parseFloat(bid);
            event.preventDefault();
            if (value <= 0) {
                event.stopPropagation();
                setFormValidated(true);
            } else {
                placeBid(value);
            }
        };

        return (
            <Form className="auction-form" noValidate validated={formValidated} onSubmit={handleSubmit} >
                <Form.Group className="margin-bottom-10" controlId="validation">
                    <Form.Label>Bid</Form.Label>
                    <InputGroup className={placeBidDisabled ? "opacity-65" : ""}>
                        <Form.Control disabled={placeBidDisabled} required type="text" placeholder="bid" min="0" value={bid} onChange={(e) => setBid(e.target.value)}/>
                        <InputGroup.Text id="ethText">ETH</InputGroup.Text>
                        <Form.Control.Feedback type="invalid">Please make a bid above 0</Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <Button type="submit" className="custom-button" disabled={placeBidDisabled}>
                    Place Bid
                </Button>
            </Form>
        );
    }

    return (
        <div className="card-column">
            <div className="card custom-card">
                <div className="card-body">
                    <h5 className="card-title">Place Bid</h5>
                    <div className="card-info">
                        {renderPlaceBidCard()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaceBidCard;