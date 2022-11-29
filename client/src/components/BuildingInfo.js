import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

export default function BuildingInfo(props) {
    const buildingInfo = props.buildingInfo;
    const isBuildingInfoOpen = props.isBuildingInfoOpen;

    return (
        <Modal show={isBuildingInfoOpen}>
            <Modal.Header>
                <Modal.Title>{buildingInfo.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h2>
                    Address: {buildingInfo.address}
                </h2>
                <h3>
                    Rating: {buildingInfo.average_rating}
                </h3>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    )
}