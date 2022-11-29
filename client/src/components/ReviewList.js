import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ReviewService from '../services/ReviewService';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';

export function ReviewList(props) {
    const locationID = props.locationID;
    const reviewType = props.reviewType;

    const [isLoaded, setLoaded] = useState(false);
    const [reviewCards, setReviewCards] = useState([]);
    const [sliceState, setSliceState] = useState();

    const loadData = async () => {
        try {
            const payload = await ReviewService.findBuildingReviews({
                location_id: locationID
            });
            buildReviewCards(payload);

            setLoaded(true);
        } catch (e) {
            throw new Error('Cannot load review data: ' + e);
        }
    }

    const buildReviewCards = (payload) => {
        const sortedPayload = payload.sort((a, b) => {
            return a.timestamp < b.timestamp;
        });

        const cards = sortedPayload.map((review, index) => {
            return (
                <div className="m-auto">
                    <ReviewCard
                        key={index}
                        payload={review}
                    />
                </div>
            )
        });

        setReviewCards(cards);
        setSliceState(cards.slice(0,3));

        return cards;
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
                <div>
                {
                    !isLoaded
                    ? 'Loading...'
                    : sliceState
                }
                </div>
                <Button // @TODO: Handle the toggle thing
                    onClick={() => setSliceState((prev) => (prev.length == 3) ? reviewCards : reviewCards.slice(0,3))}
                >
                    Load More Reviews 
                </Button>
            </div>
            <div>
                <ReviewForm 
                    locationID={locationID}
                    formType={reviewType}
                />
            </div>
        </div>
    )
}