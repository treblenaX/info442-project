import '../styles/BuildingInfo.css';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { ReviewList } from './ReviewList';
import LocationService from '../services/LocationService';
import { toast } from 'react-toastify';
import { ReviewTypes } from '../constants/ReviewTypes';
import ImageService from '../services/ImageService';
import { ImageType } from '../constants/ImageTypes';
import RatingForm from './RatingForm';
import Loading from './Loading';
import RatingUtil from '../utils/RatingUtil';

export default function BuildingInfo(props) {
    const handleSetShowBuildingInfo = props.handleSetShowBuildingInfo;
    const handleSetBuildingInfoRefresh = props.handleSetBuildingInfoRefresh;
    const buildingInfoRefresh = props.buildingInfoRefresh;
    const locationID = props.locationID;
    const showBuildingInfo = props.showBuildingInfo;

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

    const refreshBuildingInfoModal = () => handleSetBuildingInfoRefresh(true);

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

            handleSetBuildingInfoRefresh(false);
            toast.dismiss();
        } catch (e) {
            throw new Error('Cannot load review data: ' + e);
        }
    }

    useEffect(() => {
        if (buildingInfoRefresh) loadData()
            .catch((e) => {
                toast.error('' + e.message);
            });
    }, [buildingInfoRefresh])

    return (
        <div>
            <Modal show={showBuildingInfo && !buildingInfoRefresh} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title 
                        className="top-modal modal-text center-text"
                        as={Row}
                        style={{
                            width: '100%'
                        }}
                    >
                        <Col className='m-auto'>
                            <h1 className="top-modal-item">
                                <strong>
                                    {
                                        buildingInfoRefresh
                                        ? 'Loading...'
                                        : buildingPayload.name
                                    }
                                </strong>
                            </h1>
                        </Col>
                        <Col className='m-auto'>
                            <div className="m-auto top-modal-item top-modal-rating-icon">
                                {
                                    buildingInfoRefresh
                                    ? 'Loading...'
                                    : RatingUtil.chooseAverageRatingFace(buildingPayload)
                                }
                            </div>
                        </Col>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-text">
                    <p>
                        {
                            buildingInfoRefresh
                            ? 'Loading...'
                            : <em>{buildingPayload.address}</em>
                        }
                    </p>
                    <div>
                        <div className="building-info-image">
                            {
                                (!buildingImageUrls || buildingImageUrls.length == 0) 
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
                            buildingInfoRefresh
                            ? <p>Loading...</p>
                            :
                            <RatingForm 
                                averageRating={buildingPayload.average_rating}
                                locationID={locationID}
                                buildingPayload={buildingPayload}
                                handleRefreshBuildingInfoModal={refreshBuildingInfoModal}
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