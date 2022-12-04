const DEBUG = false;

const DEBUG_URI = 'http://localhost:3000';
const PROD_URI = 'https://mapable-info442.herokuapp.com/';
const API_URI = 'api';

const BASEPOINT = (DEBUG) ? DEBUG_URI : PROD_URI;

export const LOCATION_BASEPOINT = BASEPOINT + API_URI + '/locations';
export const REVIEW_BASEPOINT = BASEPOINT + API_URI + '/reviews';
export const FEATURE_BASEPOINT = BASEPOINT + API_URI + '/features';
export const USERS_BASEPOINT = BASEPOINT + API_URI + '/users';
export const IMAGES_BASEPOINT = BASEPOINT + API_URI + '/images';