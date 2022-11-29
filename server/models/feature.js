import { Model } from "./base.js";

export class Feature extends Model {
    get defaults() {
        return {
            latitude: '',
            longitude: '',
            rating: 0.0,
            type: '',
            picture_urls: []
        };
    }
}