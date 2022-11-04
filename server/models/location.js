import { Model } from "./base.js";
import { Coordinate } from "./coordinate.js";

export class Location extends Model {
    get defaults() {
        return {
            address: '',
            coordinate: new Coordinate().toObject(),
            name: '',
            average_rating: 0.0
        };
    }
}