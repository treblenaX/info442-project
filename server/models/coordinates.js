import { Model } from "./base.js";

export class Coordinates extends Model {
    get defaults() {
        return {
            latitude: null,
            longitude: null
        };
    }

}