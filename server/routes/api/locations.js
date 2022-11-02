import express from 'express';
import { Location } from '../../models/location.js';
import FirebaseHandler from '../../services/FirebaseHandler.js';

var router = express.Router();

const LOCATIONS_COLLECTION_NAME = 'locations';

router.get('/', async function(req, res, next) {
    const payload = await FirebaseHandler.getCollection(LOCATIONS_COLLECTION_NAME);
    return res.json({
        message: 'All location data successfully fetched.',
        success: true,
        payload: payload
    });
});

router.get('/single', async function(req, res, next) {
    const id = req.query.id;

    if (!id) return res.status(400).json({ 
        message: 'Please provide an id in your query.',
        error: 'Client provided no query with endpoint.' 
    });

    try {
        const payload = await FirebaseHandler.getDoc(LOCATIONS_COLLECTION_NAME, id);
        return res.json({
            message: `Location data of ID: ${id} - successfully fetched.`,
            payload: payload
        });
    } catch (e) {
        return res.status(404).json({
            message: 'Please give valid location queries.',
            error: `Location with the ID, ${id}, is not found.`
        })
    }
});

export default router;