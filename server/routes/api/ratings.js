import express from 'express';
import { LOCATIONS_COLLECTION_NAME, RATINGS_COLLECTION_NAME } from '../../constants/collections.js';
import { Rating } from '../../models/rating.js';
import FirebaseHandler from '../../services/FirebaseHandler.js';

var router = express.Router();

router.get('/', async function(req, res, next) {
    try {
        const payload = await FirebaseHandler.getDocCollection(RATINGS_COLLECTION_NAME);
        return res.json({
            message: 'All rating data successfully fetched.',
            success: true,
            payload: payload
        });
    } catch (e) {
        return res.status(500).json({
            message: 'There was an error getting all of the ratings...',
            error: '' + e
        })
    }
});

router.get('/filter', async function(req, res, next) {
    const rating_id = req.query.rating_id;
    const location_id = req.query.location_id;
    try {
        // ERROR - Don't allow multiple query parameters or none
        if (Object.keys(req.query).length != 1) {
            const error = new Error('You cannot have multiple/no query paramters here.');
            error.code = 400;
            throw error;
        }

        let payload;

        if (rating_id) {    // Get single rating document
            payload = await FirebaseHandler.getSingleDoc(RATINGS_COLLECTION_NAME, rating_id.trim());
        } else if (location_id) {   // Get filtered rating documents
            payload = await FirebaseHandler.getConditionedDoc(RATINGS_COLLECTION_NAME, {
                attributeName: 'location_id',
                comparator: '==',
                attributeValue: location_id.trim()
            });
        } else {    // ERROR - No query details provided
            const error = new Error('The queries are invalid.');
            error.code = 400;
            throw error;
        } 

        return res.status(200).json({
            message: 'Rating data successfully fetched.',
            success: true,
            payload: payload
        });
    } catch (e) {
        return res.status(e.code).json({
            message: 'There was error getting the rating...',
            error: '' + e
        })
    }
})

router.post('/', async function(req, res, next) {
    const body = req.body;  

    try {
        const location = await FirebaseHandler.getSingleDoc(LOCATIONS_COLLECTION_NAME, body.location_id);

        if (!location) {    // The location document corresponding to the rating does not exist
            const error = new Error('Cannot find the location specified.');
            error.code = 404;
            throw error;
        }

        // @TODO: Make check for valid username

        const ratingDoc = new Rating({
            location_id: body.location_id,
            username: body.username,
            value: body.rating
        }).toObject();

        const docID = await FirebaseHandler.addDoc(RATINGS_COLLECTION_NAME, ratingDoc);

        // If no ID is returned, then the FirebaseHandler failed in adding the document

        if (!docID) {
            const error = new Error('Failed to add rating to Firestore.');
            error.code = 500;
            throw error;
        }

        return res.status(200).json({
            message: 'New rating information successfully saved!',
            success: true,
            payload: {
                id: docID
            }
        });
    } catch (e) {
        return res.status(e.code).json({
            message: 'There was an error adding a rating...',
            error: '' + e
        })
    }
});

export default router;