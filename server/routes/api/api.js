import express from 'express';
var router = express.Router();

import locationsRouter from './locations.js';
import featuresRouter from './features.js'
import ratingsRouter from './ratings.js';
import usersRouter from './users.js';
import reviewsRouter from './reviews.js';
import imagesRouter from './images.js';

router.use('/locations', locationsRouter);
router.use('/features', featuresRouter)
router.use('/ratings', ratingsRouter);
router.use('/users', usersRouter);
router.use('/reviews', reviewsRouter);
router.use('/images', imagesRouter);

export default router;
