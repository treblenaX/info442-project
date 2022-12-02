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

    static chooseAverageRatingFace(buildingPayload) {
        const averageRating = buildingPayload.average_rating;

        if (averageRating <= 2) {
            return <img className="m-auto" src={require('../images/upset.png')} />;
        } else if (averageRating < 4) {
            return <img src={require('../images/neutral.png')} />;
        }

        return <img className="m-auto" src={require('../images/happy.png')} />;
    }
}