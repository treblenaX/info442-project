import express from 'express';
import bcrypt from 'bcryptjs';
import { handleErrorResponse, handleSuccessResponse } from '../../handlers/response_handlers.js';
import { USERS_COLLECTION_NAME } from '../../constants/collections.js';
import { User } from '../../models/user.js';
import FirebaseHandler from '../../handlers/firebase_handlers.js';
import { checkUserLoggedIn, handleUserSessionEnd, handleUserSessionStart } from '../../handlers/session_handlers.js';

var router = express.Router();

router.get('/heartbeat', async (req, res, next) => {
    try {
        const session = req.session;

        if (!checkUserLoggedIn) {   // If there's a cookie with no info, then it's expired
            const error = new Error('User not logged in...');
            error.code = 401;
            throw error;
        }
      
        handleSuccessResponse(res, 'User still logged in!', session.user);
    } catch (e) {
        handleErrorResponse(res, e, 'User not logged in.');
    }
  })

router.post('/login', async function(req, res, next) {
    const body = req.body;
    const username = body.username.toLowerCase().trim();
    const password = body.password.trim();

    try {
        // Get the user
        const user = (await FirebaseHandler.getConditionedDoc(USERS_COLLECTION_NAME, [{
            attributeName: 'username',
            comparator: '==',
            attributeValue: username
        }]))[0];

        // ERROR - no user exists
        if (!user) {
            const error = new Error('Username and/or password is invalid.');
            error.code = 401;
            throw error;
        }

        // Check if the password is correct
        const validPassword = await comparePassword(password, user.password);

        // ERROR - invalid password
        if (!validPassword) {
            const error = new Error('Username and/or password is invalid.');
            error.code = 401;
            throw error;
        }

        // Start the user session
        handleUserSessionStart(req, user);

        // Take out the password
        delete user.password;

        handleSuccessResponse(res, 'User successfully logged in!', user);
    } catch (e) {
        handleErrorResponse(res, e, 'There was error getting the user...');
    }
})

router.post('/signup', async function(req, res, next) {
    const body = req.body;
    const username = body.username.toLowerCase().trim();
    const password = body.password.trim();
    const fname = body.fname.trim();
    const lname = body.lname.trim();

    try {
        // Error guard - check to see if username exists
        const userCheck = await FirebaseHandler.getConditionedDoc(USERS_COLLECTION_NAME, [{
            attributeName: 'username',
            comparator: '==',
            attributeValue: username
        }]);
      
        if (userCheck.length > 0) {
            const error = new Error('The username already exists.');
            error.code = 400;
            throw error;
        }

        // Start the process of adding the user to the userbase
        const encryptedPassword = await encryptPassword(password, 10);

        const user = new User({
            username: username,
            password: encryptedPassword,
            fname: fname,
            lname: lname
        }).toObject();

        const docID = await FirebaseHandler.addDoc(USERS_COLLECTION_NAME, user);

        // If no ID is returned, then the FirebaseHandler failed in adding the document
        if (!docID) {
            const error = new Error('Failed to add user to Firestore.');
            error.code = 500;
            throw error;
        }

        // Start the user session
        handleUserSessionStart(req, user);

        // Take out the password
        delete user.password;
        
        handleSuccessResponse(res, 'New user information successfully saved!', user);
    } catch (e) {
        handleErrorResponse(res, e, 'There was error signing up the error...');
    }
});

router.post('/logout', function(req, res, next) {
    handleUserSessionEnd(req);
    handleSuccessResponse(res, 'User successfully logged out.');
});

const encryptPassword = async (plaintext, rounds) => await bcrypt.hashSync(plaintext, await bcrypt.genSalt(rounds));
const comparePassword = async (password, storedPassword) => {
    try {
        return await bcrypt.compare(password, storedPassword);
    } catch (e) {
        handleErrorResponse(res, e, 'Unable to compare the password.');
    }
}
export default router;
