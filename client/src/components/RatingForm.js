import React, { useContext, useEffect, useState } from 'react';
import { Button, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { BuildingRatingType } from '../constants/BuildingRatingType';
import { CredentialsContext } from '../contexts/CredentialsContext';
import LocationService from '../services/LocationService';
import '../styles/RatingForm.css';
import RatingUtil from '../utils/RatingUtil';

export default function RatingForm(props) {
    const averageRating = props.averageRating;
    const locationID = props.locationID
    const buildingPayload = props.buildingPayload;
    const handleSetLoading = props.handleSetLoading;

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
                if (radioValue == value) return;    // The user clicked on the same rating they rated earlier
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
            handleSetLoading(true);

            toast.info('Successfully saved rating to the server... Refreshing..');
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
            <h3 className="m-auto center-text">
                <strong>{`Rating: ${averageRating}`}</strong>
            </h3>
            {
                (!credentials)
                ? <></>
                :
                <div className="m-auto center-text">
                    <ButtonGroup className="m-auto radio-container">
                        <ToggleButton
                            key='happy'
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
                </div>
            }
        </div>
    );
}