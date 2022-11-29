import { REVIEW_BASEPOINT } from "../constants/ApiEndpoints"
import LinkBuilderUtil from "../utils/LinkBuilderUtil";

export default class ReviewService {
    static findBuildingReviews = async (request) => {    // Notice how this is an 'async' function
        // Notice how I'm using the fetch to GET information from the API
        // Notice the 'await' keyword.
        const response = await fetch(
            REVIEW_BASEPOINT + '/filter' + LinkBuilderUtil.objectToQuery(request),
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        // Notice the 'await' function here
        const responsePayload = await response.json();

        // Notice the error handling
        if (!responsePayload.error) {
            return responsePayload.payload;
        } else {
            throw new Error(responsePayload.error);
        }
    }
}