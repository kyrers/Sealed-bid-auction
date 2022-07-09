import { Button } from "react-bootstrap";

type FunctionProps = {
    openBidDisabled: boolean
    openBid: () => void;
};

function OpenBidCard({ openBidDisabled, openBid }: FunctionProps) {
    return (
        <div className="card-column">
            <div className="card custom-card">
                <div className="card-body">
                    <h5 className="card-title">Open Bid</h5>
                    <div className="card-info">
                        <Button disabled={openBidDisabled} className="custom-button" onClick={openBid}>
                            <span>Open Bid</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OpenBidCard;