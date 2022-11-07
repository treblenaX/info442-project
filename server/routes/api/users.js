import express from 'express';
import bcrypt from 'bcryptjs';
import { USERS_COLLECTION_NAME } from '../../constants/collections.js';
import { User } from '../../models/user.js';
import FirebaseHandler from '../../services/FirebaseHandler.js';

var router = express.Router();

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

        // Check if the password is correct
        const validPassword = await comparePassword(password, user.password);

        if (!validPassword) {
            const error = new Error('Username and/or password is invalid.');
            error.code = 401;
            throw error;
        }

        // @TODO handle session authentication

        return res.status(200).json({
            message: 'User successfully logged in!',
            success: true,
            payload: user
        })
    } catch (e) {
        if (!e.code) e.code = 500;
        return res.status(e.code).json({
            message: 'There was error getting the user...',
            error: '' + e
        });
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

        const userDoc = new User({
            username: username,
            password: encryptedPassword,
            fname: fname,
            lname: lname
        }).toObject();

        const docID = await FirebaseHandler.addDoc(USERS_COLLECTION_NAME, userDoc);

        // If no ID is returned, then the FirebaseHandler failed in adding the document
        if (!docID) {
            const error = new Error('Failed to add user to Firestore.');
            error.code = 500;
            throw error;
        }

        return res.status(200).json({
            message: 'New user information successfully saved!',
            success: true,
            payload: {
                id: docID
            }
        });
    } catch (e) {
        if (!e.code) e.code = 500;
        return res.status(e.code).json({
            message: 'There was error signing up the error...',
            error: '' + e
        });
    }
});

const encryptPassword = async (plaintext, rounds) => await bcrypt.hashSync(plaintext, await bcrypt.genSalt(rounds));
const comparePassword = async (password, storedPassword) => {
    try {
        return await bcrypt.compare(password, storedPassword);
    } catch (e) {
        const error = new Error('Unable to compare the password.');
        error.code = 500;
        throw error;
    }
}
export default router;
