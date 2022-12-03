import React, { useContext, useEffect, useState } from 'react';
import { Button, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { BuildingRatingType } from '../constants/BuildingRatingType';
import { CredentialsContext } from '../contexts/CredentialsContext';
import LocationService from '../services/LocationService';
import '../styles/BuildingRating.css';
import RatingUtil from '../utils/RatingUtil';

export default function BuildingRating(props) {
    const locationID = props.locationID
    const buildingPayload = props.buildingPayload;
    const handleRefreshBuildingInfoModal = props.handleRefreshBuildingInfoModal;

    const { credentials } = useContext(CredentialsContext);
    const [radioValue, setRadioValue] = useState();

    const handleRadioClick = async (e) => {
        try {
            // Don't allow the user to spam requests
            // setButtonLock(true);
            toast.info('Loading data from the server...');

            const value = e.currentTarget.value;
            const username = credentials.username;

            // Send the request to the server
            let request = {
                location_id: locationID,
                username: username
            };

            if (radioValue) {
                // The user has rated and clicked on another rating
                
                // Unrate
                request.rating_type = radioValue;
                await LocationService.unrateLocation(request);
            } 

            // Rate
            request.rating_type = value;
            await LocationService.rateLocation(request);


            // Update the local state
            setRadioValue(value);
            handleRefreshBuildingInfoModal(true);

            toast.dismiss();
            toast.info('Successfully saved rating to the server!');
        } catch (e) {
            toast.error('' + e);
        }
    }

    const handleRemoveRating = async (e) => {
        e.preventDefault();

        try {
            toast.info('Removing rating...');

            let request = {
                location_id: locationID,
                username: credentials.username,
                rating_type: radioValue
            };

            setRadioValue(null);
            await LocationService.unrateLocation(request);
            handleRefreshBuildingInfoModal(true);

            toast.dismiss();
            toast.info('Successfully removed rating!');
        } catch (e) {
            toast.error('' + e);
        }
    }

    useEffect(() => {
        // Check to see if the user has voted and select it if they have
        if (credentials) setRadioValue(RatingUtil.findUsernameInBuildingRatings(buildingPayload, credentials.username));
    }, []);
    
    return (
        <div className="m-auto">
            {
                (!credentials)
                ? 
                <p className="center-text">
                    <em>Please log in to rate the accessibility of this building.</em>
                </p>
                :
                <div className="m-auto center-text">
                    <div>
                        <p>How would you rate the overall accessibility of this building?</p>
                    </div>
                    <ButtonGroup className="m-auto radio-container">
                        <ToggleButton
                            key='happy'
                            name='happy'
                            type='radio'
                            id='radio-happy'
                            value={BuildingRatingType.HIGH}
                            checked={radioValue == BuildingRatingType.HIGH}
                            onChange={(e) => handleRadioClick(e)}
                            className='radio-button'
                            style={{
                                border: 'none'
                            }}
                        >
                            <img src={require('../images/happy.png')} />
                        </ToggleButton>
                        <ToggleButton
                            key='neutral'
                            name='neutral'
                            type='radio'
                            id='radio-neutral'
                            value={BuildingRatingType.MED}
                            checked={radioValue == BuildingRatingType.MED}
                            onChange={(e) => handleRadioClick(e)}
                            className='radio-button'
                            style={{
                                border: 'none'
                            }}
                        >
                            <img src={require('../images/neutral.png')} />
                        </ToggleButton>
                        <ToggleButton
                            key='upset'
                            name='upset'
                            type='radio'
                            id='radio-upset'
                            value={BuildingRatingType.LOW}
                            checked={radioValue == BuildingRatingType.LOW}
                            onChange={(e) => handleRadioClick(e)}
                            className='radio-button'
                            style={{
                                border: 'none'
                            }}
                        >
                            <img src={require('../images/upset.png')} />
                        </ToggleButton>
                    </ButtonGroup>
                    <div className="m-auto remove-rating-button">
                    {
                        (!radioValue)
                        ? <></>
                        :
                        <Button
                        variant="danger"
                        onClick={(e) => handleRemoveRating(e)}
                        >
                            Remove Rating
                        </Button>
                    }
                    </div>
                </div>
            }
        </div>
    );
}