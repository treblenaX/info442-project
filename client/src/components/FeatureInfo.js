import '../styles/BuildingInfo.css';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FeatureService from '../services/FeatureService';
import { Button, Modal } from 'react-bootstrap';

export default function AccessibilityFeatureInfo(props) {

    const featureID = props.featureID;

    const [isLoaded, setLoaded] = useState(false);
    const [featurePayload, setFeaturePayload] = useState();

    const handleClose = () => setLoaded(false);

    const loadData = async () => {
        try {
            const payload = await FeatureService.findFeature({
                feature_id: featureID
            });
            setFeaturePayload(payload);

            setLoaded(true);
        } catch (e) {
            throw new Error('Cannot load feature data: ' + e);
        }
    }

    useEffect(() => {
        loadData()
            .catch((e) => {
                toast.error('' + e.message);
            });
    }, [featureID])

    return (
        <div>
            <Modal show={isLoaded} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title className="top-modal modal-text">
                        <h1 className="top-modal-item">
                            <strong>
                                {
                                    isLoaded
                                    ? featurePayload.type
                                    : 'Loading...'
                                }
                            </strong>
                        </h1>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-text">
                    <h3>
                        {
                            isLoaded
                            ? `Rating: ${featurePayload.rating}`
                            : 'Loading...'
                        }
                    </h3>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}