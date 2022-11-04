import { Model } from "./base.js";

export class Review extends Model {
    get defaults() {
        return {
            location_id: '',
            username: '',
            blurb: '',
            picture_urls: []
        };
    }

}