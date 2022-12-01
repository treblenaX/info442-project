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
            hi_rating_users: [],
            med_rating_users: [],
            low_rating_users: []
        };
    }
}