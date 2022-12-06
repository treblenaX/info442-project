import '../styles/BuildingInfo.css';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { ReviewList } from './ReviewList';
import LocationService from '../services/LocationService';
import { toast } from 'react-toastify';
import { ReviewTypes } from '../constants/ReviewTypes';
import ImageService from '../services/ImageService';
import { ImageType } from '../constants/ImageTypes';
import BuildingRating from './BuildingRating';
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
        toast.info('Uploading image...');

        try {
            const payload = await ImageService.uploadImage({
                refID: locationID,
                image_type: ImageType.LOCATION
            }, imageFile);

            toast.dismiss();
            toast.info('Image has been successfully uploaded!');
            handleSetBuildingInfoRefresh(true);
        } catch (e) {
            toast.error('Cannot upload image: ' + e);
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
        } catch (e) {
            throw new Error('Cannot load review data: ' + e);
        }
    }

    useEffect(() => {
        if (buildingInfoRefresh) {
            loadData()
                .catch((e) => {
                    toast.error('' + e.message);
                });
        }
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
                            <div>
                                {
                                    buildingInfoRefresh
                                    ? 'Loading...'
                                    : 
                                    <strong>
                                        {buildingPayload.average_rating.toFixed(2)} <i className="bi bi-star-fill"></i> 
                                    </strong>
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
                            <BuildingRating 
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
                            handleRefreshBuildingInfoModal={refreshBuildingInfoModal}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer
                    className='modal-footer'
                >
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