import { USERS_BASEPOINT } from "../constants/ApiEndpoints";

export default class LoginService {
    static login = async (loginRequest) => {
        // Send the request
        const response = await fetch(
            USERS_BASEPOINT + '/login',
            {
                method: "POST",
                body: JSON.stringify(loginRequest),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        const responsePayload = await response.json();

        if (!responsePayload.error) {   // If no error is encountered
            return responsePayload.payload;
        } else {    // If an error is encountered
            console.log(responsePayload.error);
            // Return error payload with message
            throw new Error(responsePayload.error);
        }
    }

    static signup = async (signupRequest) => {
        // Send the request
        const response = await fetch(
            USERS_BASEPOINT + '/signup',
            {
                method: "POST",
                body: JSON.stringify(signupRequest),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        const responsePayload = await response.json();

        if (!responsePayload.error) {   // If no error is encountered
            return responsePayload.payload;
        } else {    // If an error is encountered
            // Return error payload with message
            throw new Error(responsePayload.error);
        }
    }
}