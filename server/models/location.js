import { Model } from "./base.js";
import { LocationType } from '../constants/location_type.js';

export class Location extends Model {
    get defaults() {
        return {
            location_type: LocationType.NULL,
            address: '',
            latitude: '',
            longitude: '',
            name: '',
            average_rating: 0.0,
            picture_urls: []
        };
    }
}