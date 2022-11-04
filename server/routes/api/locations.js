import express from 'express';
import { Location } from '../../models/location.js';
import FirebaseHandler from '../../services/FirebaseHandler.js';

var router = express.Router();

const LOCATIONS_COLLECTION_NAME = 'locations';

router.get('/', async function(req, res, next) {
    const id = req.query.id;

    if (!id) {  // GET all from 'locations' collection
        const payload = await FirebaseHandler.getDocCollection(LOCATIONS_COLLECTION_NAME);
        return res.json({
            message: 'All location data successfully fetched.',
            success: true,
            payload: payload
        });
    } else {    // GET only one specified location from 'locations'.
        try {
            const payload = await FirebaseHandler.getSingleDoc(LOCATIONS_COLLECTION_NAME, id);
            
            return res.json({
                message: 'Location data successfully fetched.',
                payload: payload
            });
        } catch (e) {
            return res.status(404).json({
                message: 'Please give a valid location id.',
                error: e
            });
        }
    }
});

router.post('/', async function(req, res, next) {
    const body = req.body;

    try {
        const locationDoc = new Location({
            address: body.address,
            latitude: body.latitude,
            longitude: body.longitude,
            name: body.name,
            average_rating: 0.0
        }).toObject();

        const docID = await FirebaseHandler.addDoc(LOCATIONS_COLLECTION_NAME, locationDoc);

        if (!docID) {
            return res.status(500).json({
                message: 'There was an error adding a location...',
                error: 'Error adding a location to Firestore with the handler.'
            });
        }

        return res.status(200).json({
            message: 'New location information successfully saved!',
            success: true,
            payload: {
                id: docID
            }
        });
    } catch (e) {
        return res.status(500).json({
            message: 'There was an error adding a location...',
            error: `Error: ${e}`
        })
    }
});

export default router;