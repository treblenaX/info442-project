import '../styles/BuildingInfo.css';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { ReviewList } from './ReviewList';
import LocationService from '../services/LocationService';
import { toast } from 'react-toastify';
import { ReviewTypes } from '../constants/ReviewTypes';
import ImageService from '../services/ImageService';
import { ImageType } from '../constants/ImageTypes';
import RatingForm from './RatingForm';

export default function BuildingInfo(props) {
    const locationID = props.locationID;

    const [isLoaded, setLoaded] = useState(false);
    const [buildingPayload, setBuildingPayload] = useState();
    const [buildingImageUrls, setBuildingImageUrls] = useState();

    const handleClose = () => {
        setBuildingPayload();
        setLoaded(false);
    }

    // @TODO take out for prod
    const [imageFile, setImageFile] = useState();
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = await ImageService.uploadImage({
                refID: locationID,
                image_type: ImageType.LOCATION
            }, imageFile);

            toast.info('Image has been successfully uploaded!');
        } catch (e) {
            throw new Error('Cannot upload image: ' + e);
        }
    }

    const loadData = async () => {
        try {
            const locationPayload = await LocationService.findLocation({
                location_id: locationID
            });
            setBuildingPayload(locationPayload);

            const imagesPayload = await ImageService.findImages({
                refID: locationID,
                image_type: 'LOCATION'
            });
            setBuildingImageUrls(imagesPayload);

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
    }, [locationID])

    return (
        <div>
            <Modal show={isLoaded} onHide={handleClose}>
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
                    <p>
                        {
                            isLoaded
                            ? <em>{buildingPayload.address}</em>
                            : 'Loading...'
                        }
                    </p>
                    <div>
                        <div className="building-info-image">
                            {
                                (!buildingImageUrls) 
                                ? <img src={require('../images/blank_image.jpg')} />
                                : <img src={buildingImageUrls[0]} />
                            }
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formFileLg" className="mb-3">
                                <Form.Label>@TODO take out - image upload for building</Form.Label>
                                <Form.Control 
                                    type="file" 
                                    size="sm" 
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                />
                            </Form.Group>
                            <Button 
                                type="submit" 
                                variant="primary"
                            >
                                Submit
                            </Button>
                        </Form>
                    </div>
                    <hr/>
                    <div>
                        {
                            isLoaded
                            ?
                            <RatingForm 
                                averageRating={buildingPayload.average_rating}
                            />
                            : <p>Loading...</p>
                        }
                    </div>
                    <hr/>
                    <div>
                        <ReviewList 
                            locationID={locationID} 
                            reviewType={ReviewTypes.BUILDING}
                        />
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