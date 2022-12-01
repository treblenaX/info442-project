export default class RatingHandler {
    static processBuildingRating(location) {
        const totalRaters = location.hi_rating_users.length + location.med_rating_users.length + location.low_rating_users.length;
        const highRaters = location.hi_rating_users.length * 5;
        const medRaters = location.med_rating_users.length * 3;
        const lowRaters = location.low_rating_users.length * 1;

        const maxValue = totalRaters * 5;
        const averageValue = (highRaters + medRaters + lowRaters) / maxValue;
        const averageRating = averageValue * 5;

        delete location.hi_rating_users;
        delete location.med_rating_users;
        delete location.low_rating_users;

        const modifiedLocation = {
            average_rating: (!averageRating) ? 0 : averageRating,
            ...location
        }

        return modifiedLocation;
    }
}