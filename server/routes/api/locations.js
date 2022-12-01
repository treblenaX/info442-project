import express from 'express';
import { Location } from '../../models/location.js';
import { LOCATIONS_COLLECTION_NAME } from '../../constants/collections.js';
import { 
    handleErrorResponse, 
    handleSuccessResponse 
} from '../../handlers/response_handlers.js';
import { LocationType } from '../../constants/location_type.js';
import FirebaseHandler from '../../handlers/firebase_handlers.js';
import { requireAuthorization } from '../../middleware/auth.js';
import { BuildingRatingType } from '../../constants/building_rating_type.js';

var router = express.Router();

router.get('/', async function(req, res, next) {
    try {
        const payload = await FirebaseHandler.getDocCollection(LOCATIONS_COLLECTION_NAME);

        const totalRaters = payload.hi_rating_users.length + payload.med_rating_users.length + payload.low_rating_users.length;
        const highRaters = payload.hi_rating_users.length * 5;
        const medRaters = payload.med_rating_users.length * 3;
        const lowRaters = payload.low_rating_users.length * 1;

        const maxValue = totalRaters * 5;
        const averageValue = (highRaters + medRaters + lowRaters) / maxValue;
        const averageRating = averageValue * 5;

        delete payload.hi_rating_users;
        delete payload.med_rating_users;
        delete payload.low_rating_users;

        const location = {
            average_rating: averageRating,
            ...location
        }

        handleSuccessResponse(res, 'All location data successfully fetched.', payload);
    } catch (e) {
        handleErrorResponse(res, e, 'There was an error getting all of the locations...');
    }
});

router.get('/filter', async function(req, res, next) {
    const locationID = req.query.location_id;
    try {
        // ERROR - Don't allow multiple query parameters or none
        if (Object.keys(req.query).length != 1) {
            const error = new Error('You cannot have multiple/no query parameters here.');
            error.code = 400;
            throw error;
        }

        let payload;
        
        if (locationID) {  // Get the single rating document
            payload = await FirebaseHandler.getSingleDoc(LOCATIONS_COLLECTION_NAME, locationID.trim());
        } else {    // ERROR - No query details provided
            const error = new Error('The queries are invalid.');
            error.code = 400;
            throw error;
        } 

        handleSuccessResponse(res, 'Location data successfully fetched.', payload);
    } catch (e) {
        handleErrorResponse(res, e, 'There was an error getting the location...');
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

        handleSuccessResponse(res, 'New location information successfully saved!', { id: docID });
    } catch (e) {
        handleErrorResponse(res, e, 'There was an error adding a location...');
    }
});

router.post('/rate/', async function(req, res, next) {
    const body = req.body;

    try {
        // ERROR - no body query
        if (!body) {
            const error = new Error('No queries were provided.');
            error.code = 400;
            throw error;
        }

        const locationID = body.location_id.trim();
        const username = body.username.trim();
        const ratingType = BuildingRatingType[body.rating_type];

        let buildingRatingType;

        switch (ratingType) {
            case BuildingRatingType.HIGH:
                buildingRatingType = 'hi_rating_users';
                break;
            case BuildingRatingType.MED:
                buildingRatingType = 'med_rating_users';
                break;
            case BuildingRatingType.LOW:
                buildingRatingType = 'low_rating_users';
                break;
        }
    
        // ERROR - user has already liked it
        const locationDoc = await FirebaseHandler.getSingleDoc(LOCATIONS_COLLECTION_NAME, locationID);

        if (locationDoc[buildingRatingType].includes(username)) {
            const error = new Error('User has already rated the location.');
            error.code = 400;
            throw error;
        }

        await FirebaseHandler.addValueToDocArray(
            LOCATIONS_COLLECTION_NAME,
            locationID,
            buildingRatingType,
            username
        );
        
        handleSuccessResponse(res, 'Rating on the location successfully submitted.');
    } catch (e) {
        handleErrorResponse(res, e, 'There was an error liking a location...');
    }
});

router.post('/unrate/', async function(req, res, next) {
    const body = req.body;

    try {
        // ERROR - no body query
        if (!body) {
            const error = new Error('No queries were provided.');
            error.code = 400;
            throw error;
        }

        const locationID = body.location_id.trim();
        const username = body.username.trim();
        const ratingType = BuildingRatingType[body.rating_type];

        let buildingRatingType;

        switch (ratingType) {
            case BuildingRatingType.HIGH:
                buildingRatingType = 'hi_rating_users';
                break;
            case BuildingRatingType.MED:
                buildingRatingType = 'med_rating_users';
                break;
            case BuildingRatingType.LOW:
                buildingRatingType = 'low_rating_users';
                break;
        }
    
        // ERROR - user has already unliked it
        const locationDoc = await FirebaseHandler.getSingleDoc(LOCATIONS_COLLECTION_NAME, locationID);
        
        if (!locationDoc[buildingRatingType].includes(username)) {
            const error = new Error('User has already unrated the location.');
            error.code = 400;
            throw error;
        }

        await FirebaseHandler.removeValueToDocArray(
            LOCATIONS_COLLECTION_NAME,
            locationID,
            buildingRatingType,
            username
        );
        
        handleSuccessResponse(res, 'Unrating on the location successfully submitted.');
    } catch (e) {
        handleErrorResponse(res, e, 'There was an error liking a location...');
    }
});

export default router;