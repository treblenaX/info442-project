import { BuildingRatingType } from "../constants/BuildingRatingType";

export default class RatingUtil {
    static findUsernameInBuildingRatings(buildingPayload, currentUsername) {
        const highUsers = buildingPayload.hi_rating_users;
        const medUsers = buildingPayload.med_rating_users;
        const lowUsers = buildingPayload.low_rating_users;

        if (highUsers.find((username) => username === currentUsername)) {
            return BuildingRatingType.HIGH;
        }

        if (medUsers.find((username) => username === currentUsername)) {
            return BuildingRatingType.MED;
        }

        if (lowUsers.find((username) => username === currentUsername)) {
            return BuildingRatingType.LOW;
        }
        
        return null;
    }
}