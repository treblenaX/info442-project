import express from 'express';
import { __dirname } from '../../app.js';
import FirebaseHandler from '../../handlers/firebase_handlers.js';
import StorageHandler from '../../handlers/storage_handlers.js';
import { IMAGES_COLLECTION_NAME, LOCATIONS_COLLECTION_NAME } from '../../constants/collections.js';
import { handleErrorResponse, handleSuccessFileResponse, handleSuccessResponse } from '../../handlers/response_handlers.js';
import { Image } from '../../models/image.js';
import { ImageType } from '../../constants/image_type.js';
import { unlinkSync } from 'fs';
import path from 'path';

var router = express.Router();

router.post('/', StorageHandler.upload().single('file'), async (req, res) => {
    try {
        const body = req.body;
    
        // ERROR - no body query provided
        if (!body) {
            const error = new Error('Please provide a valid body.')
            error.code = 404;
            throw error;
        } 
    
        // ERROR - no file provided
        if (!req.file) {
            const error = new Error('Please send over a valid file.')
            error.code = 404;
            throw error;
        }
    
        const filename = req.file.filename;
        const refID = body.refID.trim();
        const imageType = ImageType[body.image_type.trim()];

        // ERROR - Invalid image type
        if (!imageType) {
            const error = new Error('Invalid image type query was given.');
            error.code = 400;
            throw error;
        }

        // ERROR - invalid key document
        let keyDoc;

        switch (imageType) {
            case ImageType.LOCATION:
                keyDoc = FirebaseHandler.getSingleDoc(LOCATIONS_COLLECTION_NAME, refID);
                break;
            case ImageType.PROFILE: { 
                // @TODO - create PROFILE route.
                const error = new Error('PROFILE route has not been implemented yet...');
                error.code = 404;
                throw error;
            } 
            case ImageType.NULL || !imageType: {
                const error = new Error('Image type cannot be NULL.')
                error.code = 404;
                throw error;
            }
        }
    
        let docID;

        const existingImageDoc = (await FirebaseHandler.getConditionedDoc(IMAGES_COLLECTION_NAME, [{
            attributeName: 'refID',
            comparator: '==',
            attributeValue: refID.trim()
        }]))[0];

        // BUILDING - only allow one picture
        if (imageType === ImageType.LOCATION && existingImageDoc) {
            // Update the document
            await FirebaseHandler.deleteDoc(IMAGES_COLLECTION_NAME, existingImageDoc.id);
            // Delete the image in uploads
            unlinkSync(path.join(__dirname, 'uploads', existingImageDoc.filename));
        }

        const imageDoc = new Image({
            filename: filename,
            image_type: imageType,
            refID: refID
        }).toObject();
    
        docID = await FirebaseHandler.addDoc(IMAGES_COLLECTION_NAME, imageDoc);
        
        if (!docID) {
            const error = new Error('There was an error adding a image...');
            error.code = 500;
            throw error;
        }
    
        handleSuccessResponse(res, 'New image successfully saved!', { id: docID });
    } catch (e) {
        handleErrorResponse(res, e, 'There was an error posting the image...');
    }
});

router.get('/', async (req, res) => {
    const filename = req.query.filename;

    try {
        // ERROR - no file name in query
        if (!filename) {
            return res.status(404).json({
                error: 'No filename in query.',
                message: 'Please enter a valid filename in the query.'
            });
        }

        handleSuccessFileResponse(res, `${__dirname}/uploads/${filename}`);
    } catch (e) {
        handleErrorResponse(res, e, 'Could not get the image.');
    }
});

router.get('/metadata/filter', async function(req, res, next) {
    const imageType = req.query.image_type;
    const refID = req.query.refID;

    try {
        // ERROR - Don't allow multiple query parameters or none
        if (Object.keys(req.query).length > 2) {
            const error = new Error('You cannot have more two query parameters here.');
            error.code = 400;
            throw error;
        }


        // ERROR - Invalid image type
        if (!imageType) {
            const error = new Error('Invalid image type query was given.');
            error.code = 400;
            throw error;
        }

        let payload;
        
        if (refID) {
            switch (imageType) {
                case ImageType.LOCATION:
                    payload = await FirebaseHandler.getConditionedDoc(IMAGES_COLLECTION_NAME, [{
                        attributeName: 'refID',
                        comparator: '==',
                        attributeValue: refID.trim()
                    }]);
                    break;
                default:
                    break;
            }
        } else {    
            // ERROR - No query details provided
            const error = new Error('No ID was provided.');
            error.code = 400;
            throw error;
        } 

        handleSuccessResponse(res, 'Image metadata successfully fetched.', payload);
    } catch (e) {
        handleErrorResponse(res, e, 'There was an error getting the image metadata...');
    }
});

export default router;