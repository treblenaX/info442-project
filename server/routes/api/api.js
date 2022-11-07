import express from 'express';
var router = express.Router();

import locationsRouter from './locations.js';
import ratingsRouter from './ratings.js';
import usersRouter from './users.js';

router.use('/locations', locationsRouter);
router.use('/ratings', ratingsRouter);
router.use('/users', usersRouter);

export default router;
