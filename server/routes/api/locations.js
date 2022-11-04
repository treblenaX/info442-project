import express from 'express';
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

export default router;