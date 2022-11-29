import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ReviewService from '../services/ReviewService';
import { ReviewCard } from './ReviewCard';

export function ReviewList(props) {
    const locationID = props.locationID;

    const [reviewsPayload, setReviewsPayload] = useState([]);
    const [isLoaded, setLoaded] = useState(false);

    const loadData = async () => {
        try {
            const payload = await ReviewService.findBuildingReviews({
                location_id: locationID
            });
            console.log(`payload: ${payload}`);
            setReviewsPayload(payload);

            setLoaded(true);
        } catch (e) {
            throw new Error('Cannot load review data: ' + e);
        }
    }

    const buildReviewCards = (payload) => {
        return payload.map((review, index) => {
            return (
                <div className="m-auto">
                    <ReviewCard
                        key={index}
                        payload={review}
                    />
                </div>
            )
        })
    }
    
    useEffect(() => {
        // Load the data
        loadData()
            .catch((e) => {
                toast.error('' + e.message);
            });
    }, []);
  
    return (
        <div>
            <h3><strong>Reviews:</strong></h3>
            <div>
                {
                    !isLoaded
                    ? 'Loading...'
                    : buildReviewCards(reviewsPayload)
                }
            </div>
        </div>
    )
}