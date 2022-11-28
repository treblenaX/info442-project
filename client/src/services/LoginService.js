import { USERS_BASEPOINT } from "../constants/ApiEndpoints";

export default class LoginService {
    static heartbeat = async () => {
        const response = await fetch(
            USERS_BASEPOINT + '/heartbeat',
            {
                method: "GET",
                credentials: 'include',
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

    static login = async (loginRequest) => {
        // Send the request
        const response = await fetch(
            USERS_BASEPOINT + '/login',
            {
                method: "POST",
                credentials: 'include',
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
                credentials: 'include',
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

    static logout = async () => {
        // Send the request
        const response = await fetch(
            USERS_BASEPOINT + '/logout',
            {
                method: "POST",
                credentials: 'include',
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