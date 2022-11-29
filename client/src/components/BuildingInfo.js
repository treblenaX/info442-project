import '../styles/BuildingInfo.css';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { ReviewList } from './ReviewList';
import LocationService from '../services/LocationService';
import { toast } from 'react-toastify';
import { ReviewTypes } from '../constants/ReviewTypes';

export default function BuildingInfo(props) {
    const locationID = props.locationID;

    const [isLoaded, setLoaded] = useState(false);
    const [buildingPayload, setBuildingPayload] = useState();


    const loadData = async () => {
        try {
            const payload = await LocationService.findLocation({
                location_id: locationID
            });
            setBuildingPayload(payload);

            setLoaded(true);
        } catch (e) {
            throw new Error('Cannot load review data: ' + e);
        }
    }

    useEffect(() => {
        loadData()
            .catch((e) => {
                toast.error('' + e.message);
            });
    }, [])

    return (
        <div>
                <Modal show={isLoaded}>
                    <Modal.Header>
                        <Modal.Title className="top-modal modal-text">
                            <h1 className="top-modal-item">
                                <strong>
                                    {
                                        isLoaded
                                        ? buildingPayload.name
                                        : 'Loading...'
                                    }
                                </strong>
                            </h1>
                            <div className="top-modal-item top-modal-rating-icon">
                                Insert Rating Face here
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-text">
                        <h3>
                            {
                                isLoaded
                                ? <em>{buildingPayload.address}</em>
                                : 'Loading...'
                            }
                        </h3>
                        <h3>
                            {
                                isLoaded
                                ? `Rating: ${buildingPayload.average_rating}`
                                : 'Loading...'
                            }
                        </h3>
                        <div>
                            <ReviewList 
                                locationID={locationID} 
                                reviewType={ReviewTypes.BUILDING}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
        </div>
    )
}