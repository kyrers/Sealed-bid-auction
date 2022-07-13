import { useState } from 'react';
import { Button, CloseButton, Modal } from 'react-bootstrap';
import { InfoCircle } from 'react-bootstrap-icons';

function HelpModal() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const helpText =
        "This is a sealed bid auction house. \n\n" +
        "If there's a live auction, you have until the auction ends to place your bid. \n\n" +
        "Then, every auction has a five minute opening bid period. If you open your bid and are not the highest bidder, you receive your funds back. " +
        "If you are, you will either win the auction or receive your funds if someone opens a higher bid. \n\n" +
        "IMPORTANT: If you fail to open your bid in the valid period you will lose your funds!";

    return (
        <>
            <InfoCircle className="info-button" color="darkgray" onClick={handleShow} />
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>How it works</Modal.Title>
                </Modal.Header>
                <Modal.Body className="white-space-break-spaces">{helpText}</Modal.Body>
                <Modal.Footer>
                    <Button className="custom-button" variant="secondary" onClick={handleClose}>
                        Got it
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default HelpModal;