import { LOCATION_BASEPOINT } from "../constants/ApiEndpoints"

export class LocationService {
    static findLocations = async () => {
        const response = await fetch(
            LOCATION_BASEPOINT,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        const responsePayload = await response.json();

        if (!responsePayload.error) {
            return responsePayload.payload;
        } else {
            throw new Error(responsePayload.error);
        }
    }
}