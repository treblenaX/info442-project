import { ImageType } from "../constants/image_type.js";
import { Model } from "./base.js";

export class Image extends Model {
    get defaults() {
        return {
            filename: '',
            image_type: ImageType.NULL,
            refID: '',
            created_date: Date.now()
        };
    }
}