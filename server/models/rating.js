import { Model } from "./base.js";

export class Rating extends Model {
    get defaults() {
        return {
            location_id: '',
            username: '',
            value: -1
        };
    }

}