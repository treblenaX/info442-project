import express from 'express';
import { Location } from '../../models/location.js';
import { LOCATIONS_COLLECTION_NAME } from '../../constants/collections.js';
import { LocationType } from '../../constants/location_type.js';
import FirebaseHandler from '../../services/FirebaseHandler.js';

var router = express.Router();

router.get('/', async function(req, res, next) {
    try {
        const payload = await FirebaseHandler.getDocCollection(LOCATIONS_COLLECTION_NAME);
        return res.json({
            message: 'All location data successfully fetched.',
            success: true,
            payload: payload
        });
    } catch (e) {
        return res.status(500).json({
            message: 'There was an error getting all of the locations...',
            error: '' + e
        })
    }
});

router.get('/filter', async function(req, res, next) {
    const location_id = req.query.location_id;
    try {
        // ERROR - Don't allow multiple query parameters or none
        if (Object.keys(req.query).length != 1) {
            const error = new Error('You cannot have multiple/no query paramters here.');
            error.code = 400;
            throw error;
        }

        let payload;
        
        if (location_id) {  // Get the single rating document
            payload = await FirebaseHandler.getSingleDoc(LOCATIONS_COLLECTION_NAME, location_id.trim());
        } else {    // ERROR - No query details provided
            const error = new Error('The queries are invalid.');
            error.code = 400;
            throw error;
        } 

        return res.status(200).json({
            message: 'Location data successfully fetched.',
            success: true,
            payload: payload
        });
    } catch (e) {
        if (!e.code) e.code = 500;
        return res.status(e.code).json({
            message: 'There was an error getting the location...',
            error: '' + e
        });
    }
});

router.post('/', async function(req, res, next) {
    const body = req.body;  

    try {
        const locationDoc = new Location({
            location_type: LocationType.NULL,
            address: body.address,
            latitude: body.latitude,
            longitude: body.longitude,
            name: body.name,
            average_rating: 0.0,
            picture_urls: [] // @TODO handle image shit
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
        if (!e.code) e.code = 500;
        return res.status(500).json({
            message: 'There was an error adding a location...',
            error: '' + e
        })
    }
});

export default router;