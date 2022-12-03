import { Model } from "./base.js";

export class Feature extends Model {
    get defaults() {
        return {
            latitude: '',
            longitude: '',
            upvoters: [],
            downvoters: [],
            type: ''
        };
    }
}