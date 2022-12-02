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
import Loading from './Loading';

export default function BuildingInfo(props) {
    const locationID = props.locationID;
    const showBuildingInfo = props.showBuildingInfo;
    const handleSetShowBuildingInfo = props.handleSetShowBuildingInfo;

    const [isLoading, setLoading] = useState(true);
    const [buildingPayload, setBuildingPayload] = useState();
    const [buildingImageUrls, setBuildingImageUrls] = useState();

    const handleClose = () => {
        handleSetShowBuildingInfo(false);
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

            setLoading(false);
        } catch (e) {
            throw new Error('Cannot load review data: ' + e);
        }
    }

    useEffect(() => {
        if (isLoading) loadData()
            .catch((e) => {
                toast.error('' + e.message);
            });
    }, [isLoading])

    return (
        <div>
            <Modal show={showBuildingInfo && !isLoading} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title className="top-modal modal-text">
                        <h1 className="top-modal-item">
                            <strong>
                                {
                                    isLoading
                                    ? 'Loading...'
                                    : buildingPayload.name
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
                            isLoading
                            ? 'Loading...'
                            : <em>{buildingPayload.address}</em>
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
                    <div >
                        {
                            isLoading
                            ? <p>Loading...</p>
                            :
                            <RatingForm 
                                averageRating={buildingPayload.average_rating}
                                locationID={locationID}
                                buildingPayload={buildingPayload}
                                handleSetLoading={setLoading}
                            />
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