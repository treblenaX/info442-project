export const DEBUG = false;

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import * as dotenv from 'dotenv';
import sessions from 'express-session';
import FirebaseHandler from './handlers/firebase_handlers.js';

import indexRouter from './routes/index.js';
import apiRouter from './routes/api/api.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

dotenv.config();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'https://mapable-info442.herokuapp.com/'];
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        // if(allowedOrigins.indexOf(origin) === -1){
        // var msg = 'The CORS policy for this site does not ' +
        //             'allow access from the specified Origin.';
        // return callback(new Error(msg), false);
        // }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // origin: '*',
    credentials: true
}));
app.use(cookieParser());

// Firebase - database stuff
FirebaseHandler.initFirebaseApp();

// Sessions - Handles the express session stuff
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: 'efaelirgerlfherlkufhaekhfkuh',
    cookie: {
        secure: false,
        sameSite: "lax",
        maxAge: oneDay
    },
    resave: false
}));

app.use(express.static('public'));
app.use(express.static('uploads'));

app.use('/api', apiRouter);
app.use('/', indexRouter);  // Make sure it's at the end

export default app;
