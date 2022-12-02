export default class RatingHandler {
    static processBuildingRating(location) {
        const totalRaters = location.hi_rating_users
            .concat(location.med_rating_users)
            .concat(location.low_rating_users);
        const totalRatersLength = totalRaters.length;

        const highRaters = location.hi_rating_users.length * 5;
        const medRaters = location.med_rating_users.length * 3;
        const lowRaters = location.low_rating_users.length * 1;

        const maxValue = totalRatersLength * 5;
        const averageValue = (highRaters + medRaters + lowRaters) / maxValue;
        const averageRating = averageValue * 5;
        
        const modifiedLocation = {
            average_rating: (!averageRating) ? 0 : averageRating,
            ...location
        }

        return modifiedLocation;
    }
}