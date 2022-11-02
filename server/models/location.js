import { Model } from "./base.js";
import { Coordinates } from "./coordinates.js";

export class Location extends Model {
    get defaults() {
        return {
            address: '',
            coordinates: new Coordinates().toObject(),
            name: '',
            average_rating: 0.0,
            ratings: [],
            reviews: [],
            accessibility_points: []
        };
    }
}