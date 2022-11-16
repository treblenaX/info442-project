import express from 'express';
import { LOCATIONS_COLLECTION_NAME, REVIEWS_COLLECTION_NAME } from '../../constants/collections.js';
import { handleErrorResponse, handleSuccessResponse } from '../../handlers/response_handlers.js';
import { requireAuthorization } from '../../middleware/auth.js';
import { Review } from '../../models/review.js';
import FirebaseHandler from '../../handlers/firebase_handlers.js';

var router = express.Router();

router.get('/', async function(req, res, next) {
    try {
        const payload = await FirebaseHandler.getDocCollection(REVIEWS_COLLECTION_NAME);
        handleSuccessResponse(res, 'All review data successfully fetched.', payload);
    } catch (e) {
        handleErrorResponse(res, e, 'There was an error getting all of the reviews...');
    }
});

router.get('/filter', async function(req, res, next) {
    const review_id = req.query.review_id;
    const location_id = req.query.location_id;
    try {
        // ERROR - Don't allow multiple query parameters or none
        if (Object.keys(req.query).length != 1) {
            const error = new Error('You cannot have multiple/no query parameters here.');
            error.code = 400;
            throw error;
        }

        let payload;

        if (review_id) {    // Get single rating document
            payload = await FirebaseHandler.getSingleDoc(REVIEWS_COLLECTION_NAME, review_id.trim());
        } else if (location_id) {   // Get filtered rating documents
            payload = await FirebaseHandler.getConditionedDoc(REVIEWS_COLLECTION_NAME, [{
                attributeName: 'location_id',
                comparator: '==',
                attributeValue: location_id.trim()
            }]);
        } else {    // ERROR - No query details provided
            const error = new Error('The queries are invalid.');
            error.code = 400;
            throw error;
        } 

        handleSuccessResponse(res, 'Review data successfully fetched.', payload);
    } catch (e) {
        handleErrorResponse(res, e, 'There was error getting the review...');
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
        const location = await FirebaseHandler.getSingleDoc(LOCATIONS_COLLECTION_NAME, body.location_id);

        if (!location) {    // The location document corresponding to the rating does not exist
            const error = new Error('Cannot find the location specified.');
            error.code = 404;
            throw error;
        }

        // @TODO: Make check for valid username

        const reviewDoc = new Review({
            location_id: body.location_id,
            username: body.username,
            blurb: body.blurb,
            picture_urls: body.picture_urls
        }).toObject();

        const docID = await FirebaseHandler.addDoc(REVIEWS_COLLECTION_NAME, reviewDoc);

        // If no ID is returned, then the FirebaseHandler failed in adding the document
        if (!docID) {
            const error = new Error('Failed to add review to Firestore.');
            error.code = 500;
            throw error;
        }

        handleSuccessResponse(res, 'New review information successfully saved!', { id: docID });
    } catch (e) {
        handleErrorResponse(res, e, 'There was an error adding a review...');
    }
});

export default router;