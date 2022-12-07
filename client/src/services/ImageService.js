import { IMAGES_BASEPOINT } from "../constants/ApiEndpoints";
import LinkBuilderUtil from "../utils/LinkBuilderUtil";

export default class ImageService {
    static findImages = async (request) => {
        let urlArray = [];
        // Look for the stored image metadata
        const metadataResponse = await fetch(
            IMAGES_BASEPOINT + '/metadata/filter' + LinkBuilderUtil.objectToQuery(request),
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        // Wait for the response
        const metadataResponsePayload = await metadataResponse.json();


        if (metadataResponsePayload.error) throw new Error(metadataResponsePayload.error);

        for (let metadata of metadataResponsePayload.payload) {
            urlArray.push(`${IMAGES_BASEPOINT}/?filename=${metadata.filename}`);
        }

        return urlArray;
    }

    static uploadImage = async (request, image) => {
        const formData = new FormData();
        formData.append('file', image);
        console.log(IMAGES_BASEPOINT + '/');
        
        for (let item in request) {
            formData.append(item, request[item]);
        }
        
        const response = await fetch(
            IMAGES_BASEPOINT + '/',
            {
                method: "POST",
                body: formData
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