import { Model } from "./base.js";

export class AccessibilityPoint extends Model {
    get defaults() {
        return {
            latitude: null,
            longitude: null
        };
    }

}