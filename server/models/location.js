import { Model } from "./base.js";
import { Coordinate } from "./coordinate.js";

export class Location extends Model {
    get defaults() {
        return {
            address: '',
            latitude: '',
            longitude: '',
            name: '',
            average_rating: 0.0
        };
    }
}