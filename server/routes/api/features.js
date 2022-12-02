import express from 'express';
import { Feature } from '../../models/feature.js';
import { FEATURES_COLLECTION_NAME } from '../../constants/collections.js';
import { handleErrorResponse, handleSuccessResponse } from '../../handlers/response_handlers.js';
import FirebaseHandler from '../../handlers/firebase_handlers.js';
import { requireAuthorization } from '../../middleware/auth.js';

var router = express.Router();

router.get('/', async function(req, res, next) {
    try {
        const payload = await FirebaseHandler.getDocCollection(FEATURES_COLLECTION_NAME);
        handleSuccessResponse(res, 'All feature data successfully fetched.', payload);
    } catch (e) {
        handleErrorResponse(res, e, 'There was an error getting all of the features...');
    }
});

router.get('/filter', async function(req, res, next) {
    const featureID = req.query.feature_id;
    try {
        // ERROR - Don't allow multiple query parameters or none
        if (Object.keys(req.query).length != 1) {
            const error = new Error('You cannot have multiple/no query parameters here.');
            error.code = 400;
            throw error;
        }

        let payload;
        
        if (featureID) {  // Get the single rating document
            payload = await FirebaseHandler.getSingleDoc(FEATURES_COLLECTION_NAME, featureID.trim());
        } else {    // ERROR - No query details provided
            const error = new Error('The queries are invalid.');
            error.code = 400;
            throw error;
        } 

        handleSuccessResponse(res, 'Feature data successfully fetched.', payload);
    } catch (e) {
        handleErrorResponse(res, e, 'There was an error getting the feature...');
    }
});

/** 
 * 
 * Authorized endpoints
 * 
 * */
router.post('/', requireAuthorization, async function(req, res, next) {
    const body = req.body;

    try {
        const featureDoc = new Feature({
            latitude: body.latitude,
            longitude: body.longitude,
            rating: 0,
            type: body.type,
            picture_urls: [] // @TODO handle image shit
        }).toObject();

        const docID = await FirebaseHandler.addDoc(FEATURES_COLLECTION_NAME, featureDoc);

        if (!docID) {
            return res.status(500).json({
                message: 'There was an error adding a feature...',
                error: 'Error adding a feature to Firestore with the handler.'
            });
        }

        handleSuccessResponse(res, 'New feature information successfully saved!', { id: docID });
    } catch (e) {
        handleErrorResponse(res, e, 'There was an error adding a feature...');
    }
});

export default router;