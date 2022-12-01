import '../styles/BuildingInfo.css';
import React, { useEffect, useState } from 'react';
import { Button, Modal, DropdownButton, Dropdown } from 'react-bootstrap';
import FeatureService from '../services/FeatureService';
import { toast } from 'react-toastify';

export default function NewFeature(props) {

    const [isLoaded, setLoaded] = useState();
    const [coords, setCoords] = useState();
    const [featureType, setFeatureType] = useState();

    useEffect(() => {
        console.log(props.active)
        setLoaded(props.active);
    }, [props.active])

    const handleClose = () => {
        setLoaded(false);
        props.setActive(false)
    }

    const onSelect = (e) => {
        setFeatureType(e);
    }

    const handleSubmit = async (e) => {
        setCoords(props.coords);
        e.preventDefault();

        try {
            let payload;

            const base = {
                latitude: coords[0],
                longitude: coords[1],
                rating: 0
            };

            payload = await FeatureService.postNewFeature({
                ...base,
                type: featureType
            });
            if (!payload) {
                throw new Error('Null payload?');
            }
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
                    <div>
                        <img src='../styles/addimage.png' alt="add image button"></img>
                    </div>
                    <DropdownButton id="dropdown-basic-button" title="Feature type" onSelect={onSelect}>
                        <Dropdown.Item eventKey="ramp">Ramp</Dropdown.Item>
                        <Dropdown.Item eventKey="elevator">Elevator</Dropdown.Item>
                        <Dropdown.Item eventKey="automatic-door">Automatic Door</Dropdown.Item>
                    </DropdownButton>
                    <Button onClick={handleSubmit} type="submit" variant="primary">
                        Submit
                    </Button>
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