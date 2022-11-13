import { Model } from "./base.js";

export class Image extends Model {
    get defaults() {
        return {
            filename: '',
            created_date: Date.now()
        };
    }
}