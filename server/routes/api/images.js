import express from 'express';
import { __dirname } from '../../app.js';
import { unlinkSync } from 'fs';
import { requireAuthorization } from '../../middleware/auth.js';
import FirebaseHandler from '../../services/FirebaseHandler.js';
import StorageHandler from '../../handlers/storage_handlers.js';
import { IMAGES_COLLECTION_NAME } from '../../constants/collections.js';
import { handleSuccessResponse } from '../../handlers/response_handlers.js';
import { Image } from '../../models/image.js';

var router = express.Router();

router.post('/', requireAuthorization, async (req, res) => {
    const body = req.body;

    // Error guard - no body query provided
    if (!body) {
        const error = new Error('Please provide a valid body.')
        error.code = 404;
        throw error;
    }

    // Error guard - no file provided
    if (!req.file) {
        const error = new Error('Please send over a valid file.')
        error.code = 404;
        throw error;
    }

    const filename = req.file.filename;
    const username = req.session.username;

    // Error guard - user is not logged in
    if (!username) {
        const error = new Error('User is not logged in.');
        error.code = 400;
        throw error;
    }

    // Error guard - image already exists
    const image = FirebaseHandler.getSingleDoc(IMAGES_COLLECTION_NAME, filename.trim());

    if (!image) {
        //@TODO delete image from db
        // Delete the image in uploads
        unlinkSync(filename.join(__dirname, 'uploads', existingProfileImage.filename));

        const error = new Error('The file already exists...')
        error.code = 404;
        throw error;
    }

    const imageDoc = new Image({
        filename: filename
    }).toObject();

    const docID = await FirebaseHandler.addDoc(IMAGES_COLLECTION_NAME, imageDoc);

    if (!docID) {
        const error = new Error('There was an error adding a image...');
        error.code = 500;
        throw error;
    }

    handleSuccessResponse(res, 'New image successfully saved!', { id: docID });
});

router.get('/', async (req, res) => {
    const filename = req.query.filename;

    if (!filename) {  // Error guard
        return res.status(404).json({
            error: 'No filename in query.',
            message: 'Please enter a valid filename in the query.'
        });
    }

    const tokens = filename.split('.');

    res.set('Content-Type', `image/${tokens[tokens.length - 1]}`);
    return res.sendFile(`${__dirname}/uploads/${filename}`);
});

export default router;