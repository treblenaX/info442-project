import express from 'express';
var router = express.Router();

import locationsRouter from './locations.js';
import ratingsRouter from './ratings.js';

router.use('/locations', locationsRouter);
router.use('/ratings', ratingsRouter);

export default router;
