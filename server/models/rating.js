import { Model } from "./base.js";

export class Rating extends Model {
    get defaults() {
        return {
            latitude: null,
            longitude: null
        };
    }

}