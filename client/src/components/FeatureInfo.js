import '../styles/BuildingInfo.css';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FeatureService from '../services/FeatureService';
import { Button, Modal } from 'react-bootstrap';
import { CredentialsContext } from '../contexts/CredentialsContext';

export default function AccessibilityFeatureInfo(props) {
    const { credentials } = useContext(CredentialsContext);

    const featureID = props.featureID;
    const featureNameMap = {
        "elevator": "Elevator",
        "ramp": "Ramp",
        "automatic-door": "Automatic Door"
    }

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

    function rating(change) {
        if(!credentials) {
            toast.error("You must be logged in to rate features!");
        } else {
            let newRating = featurePayload.rating + change;
            console.log(newRating)

            try {
                let payload;

                const base = {
                    rating: newRating
                };

                payload = FeatureService.postReview({
                    ...base,
                    feature_id: featureID,
                });

                if (!payload) {
                    throw new Error('Null payload?');
                }
            } catch (e) {
                throw new Error('Something went wrong with posting a review... ' + e);
            }
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
                                    ? featureNameMap[featurePayload.type]
                                    : 'Loading...'
                                }
                            </strong>
                        </h1>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-text">
                    <div class="feature-img">
                        <img></img>
                    </div>
                    <div class="rating-container">
                        <Button onClick={() => rating(-1)}>-</Button>
                        <h3 className="bold">
                            {
                                isLoaded
                                ? featurePayload.rating
                                : 'Loading...'
                            }
                        </h3>
                        <Button onClick={() => rating(1)}>+</Button>
                    </div>
                    
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