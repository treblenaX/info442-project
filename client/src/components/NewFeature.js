import '../styles/BuildingInfo.css';
import React, { useEffect, useState, useContext } from 'react';
import { Button, Modal, DropdownButton, Dropdown, Form, Row, Col } from 'react-bootstrap';
import FeatureService from '../services/FeatureService';
import { CredentialsContext } from '../contexts/CredentialsContext';
import ImageService from '../services/ImageService';
import { ImageType } from '../constants/ImageTypes';
import { toast } from 'react-toastify';

export default function NewFeature(props) {
    const { credentials } = useContext(CredentialsContext);
    const [isLoaded, setLoaded] = useState();
    const [coords, setCoords] = useState();
    const [featureType, setFeatureType] = useState("");
    const [imageFile, setImageFile] = useState();
    const [dropdownVal, setDropdownVal] = useState("Select a feature type");

    useEffect(() => {
        setLoaded(props.active); // set active window state to active
    }, [props.active])

    useEffect(() => {
        setCoords(props.coords);
    }, [props.coords])

    const dropdownHandler = (text) => {
        setDropdownVal(text);
    }

    const handleClose = () => {
        setLoaded(false);
        props.setActive(false) // reset active window state back to false
    }

    const onSelect = (e) => {
        setFeatureType(e);
    }

    const handleSubmit = async (e) => {
        setCoords(props.coords);
        e.preventDefault();

        try {
            if(!(credentials)) {
                toast.error("You must be logged in to post a new feature!")
                return
            }

            if(featureType === "") {    // checks if type is empty
                toast.error("You must select a feature type")
                return
            }

            let payload;

            const base = {
                latitude: coords.lng,
                longitude: coords.lat,
            };

            payload = await FeatureService.postNewFeature({
                ...base,
                type: featureType
            });

            const imagePayload = await ImageService.uploadImage({
                refID: payload.id,
                image_type: ImageType.FEATURE
            }, imageFile);

            if (!payload) {
                throw new Error('Null payload?');
            }

            handleClose();
            window.location.reload();
        } catch (e) {
            throw new Error('Something went wrong with posting a new feature... ' + e);
        }
    }

    return (
        <div>
            <Modal show={isLoaded} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title className="top-modal modal-text">
                        <h1 className="top-modal-item">
                            <strong>
                                Add New Feature
                            </strong>
                        </h1>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-text">
                    {
                        (!credentials)
                        ? <p>Please log in to add a feature!</p>
                        :
                        <div>
                            <div>
                                <p>Please upload images that are .jpg, .jpeg, or .png under 10 MB!</p>
                                <Form>
                                    <Form.Group controlId="formFileLg" className="mb-3">
                                        <Form.Control 
                                            type="file" 
                                            size="sm" 
                                            onChange={(e) => setImageFile(e.target.files[0])}
                                        />
                                    </Form.Group>
                                </Form>
                            </div>
                            <div>
                                <Row>
                                    <Col>
                                        <DropdownButton 
                                            id="dropdown-feature-type" 
                                            title={dropdownVal} 
                                            onSelect={onSelect}
                                            style={{
                                                height: '15rem'
                                            }}
                                        >
                                            <Dropdown.Item eventKey="ramp" onClick={(e) => dropdownHandler(e.target.textContent)}>Ramp</Dropdown.Item>
                                            <Dropdown.Item eventKey="elevator" onClick={(e) => dropdownHandler(e.target.textContent)}>Elevator</Dropdown.Item>
                                            <Dropdown.Item eventKey="automatic-door" onClick={(e) => dropdownHandler(e.target.textContent)}>Automatic Door</Dropdown.Item>
                                        </DropdownButton>
                                    </Col>
                                    <Col>
                                        <Button onClick={handleSubmit} type="submit" variant="primary">
                                            Submit
                                        </Button>
                                    </Col>
                                </Row>
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