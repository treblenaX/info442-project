import { Model } from "./base.js";

export class User extends Model {
    get defaults() {
        return {
            latitude: null,
            longitude: null
        };
    }

}