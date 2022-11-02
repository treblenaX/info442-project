import express from 'express';
var router = express.Router();

import locationsRouter from './locations.js';

router.use('/locations', locationsRouter);

export default router;
