import '../styles/BuildingInfo.css';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FeatureService from '../services/FeatureService';
import ImageService from '../services/ImageService';
import { Button, ButtonGroup, Col, Modal, Row, ToggleButton } from 'react-bootstrap';
import { CredentialsContext } from '../contexts/CredentialsContext';
import { FeatureRatingType } from '../constants/FeatureRatingType';

export default function AccessibilityFeatureInfo(props) {
    const setFeatureInfoRefresh = props.setFeatureInfoRefresh;
    const setShowFeatureInfo = props.setShowFeatureInfo;
    const showFeatureInfo = props.showFeatureInfo;
    const featureInfoRefresh = props.featureInfoRefresh;

    const { credentials } = useContext(CredentialsContext);
    const [radioValue, setRadioValue] = useState();
    const [featureImageUrls, setFeatureImageUrls] = useState();

    const featureID = props.featureID;
    const featureNameMap = {
        "elevator": "Elevator",
        "ramp": "Ramp",
        "automatic-door": "Automatic Door"
    }

    const [featurePayload, setFeaturePayload] = useState();
    const [featureRating, setFeatureRating] = useState();

    const handleClose = () => setShowFeatureInfo(false);

    const loadData = async () => {
        try {
            // Load feature data
            const payload = await FeatureService.findFeature({
                feature_id: featureID
            });
            setFeaturePayload(payload);

            // Figure out if the user has already rated
            if (credentials) {
                if (payload.upvoters.find((username) => credentials.username === username)) {
                    setRadioValue(FeatureRatingType.UP);
                }

                if (payload.downvoters.find((username) => credentials.username === username)) {
                    setRadioValue(FeatureRatingType.DOWN);
                }
            }

            // Calculate the rating
            setFeatureRating(payload.upvoters.length - payload.downvoters.length);

            const imagesPayload = await ImageService.findImages({
                refID: featureID,
                image_type: 'FEATURE'
            });

            setFeatureImageUrls(imagesPayload);
            setFeatureInfoRefresh(false);
        } catch (e) {
            throw new Error('Cannot load feature data: ' + e);
        }
    }

    const handleRadioClick = async (e) => {
        try {
            // Don't allow the user to spam requests
            // setButtonLock(true);
            toast.info('Loading data from the server...');

            const value = e.currentTarget.value;
            const username = credentials.username;

            // Send the request to the server
            let request = {
                feature_id: featureID,
                username: username
            };

            if (radioValue) {
                if (radioValue == value) return;    // The user clicked on the same rating they rated earlier
                // The user has rated and clicked on another rating
                
                // Unrate
                request.rating_type = radioValue;
                await FeatureService.unrateFeature(request);
            } 

            // Rate
            request.rating_type = value;
            await FeatureService.rateFeature(request);

            // Update the local state
            setRadioValue(value);
            setFeatureInfoRefresh(true);

            toast.dismiss();
            toast.info('Successfully saved rating to the server!');
        } catch (e) {
            toast.error('' + e);
        }
    }

    const handleRatingRemove = async () => {
        try {
            let request = {
                feature_id: featureID,
                username: credentials.username,
                rating_type: radioValue
            };

            await FeatureService.unrateFeature(request);

            setRadioValue(null);
            setFeatureInfoRefresh(true);
            
            toast.dismiss();
            toast.info('Successfully cleared rating!');
        } catch (e) {
            toast.error('' + e);
        }
    }

    useEffect(() => {
        if (featureInfoRefresh) {
            loadData()
                .catch((e) => {
                    toast.error('' + e.message);
                });
        }
    }, [featureInfoRefresh])

    return (
        <div>
            <Modal show={showFeatureInfo && !featureInfoRefresh} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title className="m-auto top-modal modal-text">
                        <Row>
                            <Col>
                                <h1 className="top-modal-item">
                                    <strong>
                                        {
                                            featureInfoRefresh
                                            ? 'Loading...'
                                            : featureNameMap[featurePayload.type]
                                        }
                                    </strong>
                                </h1>
                            </Col>
                            <Col className="m-auto">
                                <h3 className="m-auto bold">
                                    {
                                        featureInfoRefresh
                                        ? 'Loading...'
                                        : featureRating
                                    }
                                </h3>
                            </Col>
                        </Row>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-text">
                    <div className="building-info-image">
                            {
                                (!featureImageUrls || featureImageUrls.length == 0) 
                                ? <img src={require('../images/blank_image.jpg')} />
                                : <img src={featureImageUrls[0]} />
                            }
                    </div>
                    {
                        (!credentials)
                        ? <></>
                        :
                        <div className="rating-container">
                            <ButtonGroup className="m-auto radio-container">
                                <ToggleButton
                                    key='+'
                                    type='radio'
                                    id='radio-+'
                                    value={FeatureRatingType.UP}
                                    checked={radioValue == FeatureRatingType.UP}
                                    onChange={(e) => handleRadioClick(e)}
                                    className='radio-button'
                                >
                                    <strong>+</strong>
                                </ToggleButton>
                                <ToggleButton
                                    key='-'
                                    type='radio'
                                    id='radio--'
                                    value={FeatureRatingType.DOWN}
                                    checked={radioValue == FeatureRatingType.DOWN}
                                    onChange={(e) => handleRadioClick(e)}
                                    className='radio-button'
                                    style={{
                                        border: 'none'
                                    }}
                                >
                                    <strong>-</strong>
                                </ToggleButton>
                            </ButtonGroup>
                            <div>
                                {
                                    (!radioValue)
                                    ? <></>
                                    :
                                    <Button
                                        variant="danger"
                                        onClick={handleRatingRemove}
                                    >
                                        Remove Rating
                                    </Button>
                                }
                            </div>
                        </div>
                    }        
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