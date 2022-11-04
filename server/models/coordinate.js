import { Model } from "./base.js";

export class Coordinate extends Model {
    get defaults() {
        return {
            latitude: null,
            longitude: null
        };
    }

}