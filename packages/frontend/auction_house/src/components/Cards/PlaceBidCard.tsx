import { useState } from 'react';
import { Button, Form, InputGroup } from "react-bootstrap";

type FunctionProps = {
    placeBidDisabled: boolean
    placeBid: (_bid: number) => void;
};

function PlaceBidCard({ placeBidDisabled, placeBid }: FunctionProps) {
    const [formValidated, setFormValidated] = useState(false);
    const [bid, setBid] = useState(0.5);

    const renderPlaceBidCard = () => {
        const handleSubmit = (event: any) => {
            const form = event.currentTarget;

            event.preventDefault();
            if (form.checkValidity() === false) {
                event.stopPropagation();
                setFormValidated(true);
            } else {
                placeBid(bid);
            }
        };

        return (
            <Form className="auction-form" noValidate validated={formValidated} onSubmit={handleSubmit} >
                <Form.Group className="margin-bottom-10" controlId="validation">
                    <Form.Label>Bid</Form.Label>
                    <InputGroup className={placeBidDisabled ? "opacity-65" : ""}>
                        <Form.Control disabled={placeBidDisabled} required type="double" placeholder="bid" min="0" value={bid} onChange={(e) => setBid(Number(e.target.value))}/>
                        <InputGroup.Text id="minText">ETH</InputGroup.Text>
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