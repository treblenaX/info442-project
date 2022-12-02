import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ReviewService from '../services/ReviewService';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';

export function ReviewList(props) {
    const locationID = props.locationID;
    const reviewType = props.reviewType;

    const [isListLoading, setListLoading] = useState(true);
    const [reviewCards, setReviewCards] = useState([]);
    const [sliceState, setSliceState] = useState([]);

    const loadData = async () => {
        try {
            const payload = await ReviewService.findBuildingReviews({
                location_id: locationID
            });
    
            const cards = payload
                .sort((a, b) => {
                    return a.timestamp < b.timestamp;
                })
                .map((review, index) => {
                    return (
                        <div 
                            key={index}
                            className="m-auto"
                        >
                            <ReviewCard
                                payload={review}
                            />
                        </div>
                    )
                });

            setReviewCards(cards);
            setSliceState(cards.slice(0,3));
            setListLoading(false);
        } catch (e) {
            throw new Error('Cannot load review data: ' + e);
        }
    }
    
    useEffect(() => {
        // Load the data
        loadData()
            .catch((e) => {
                toast.error('' + e.message);
            });
    }, [isListLoading]);
  
    return (
        <div>
            <h3><strong>Reviews:</strong></h3>
            <div>
                <div>
                {
                    (isListLoading)
                    ? 'Loading...'
                    : sliceState
                }
                </div>
                <div>
                    {
                        (sliceState.length == 0)
                        ? 
                        <div>
                            <p>No reviews found...</p>
                        </div>
                        : 
                        <div>
                            {
                                (reviewCards.length < 3)
                                ? <></>
                                :
                                <Button // @TODO: Handle the toggle thing
                                    onClick={() => setSliceState((prev) => (prev.length == 3) ? reviewCards : reviewCards.slice(0,3))}
                                >
                                    {
                                        (sliceState.length >= 3)
                                        ? 'Load More Reviews'
                                        : 'Collapse Reviews'
                                    }
                                </Button>
                            }
                        </div>
                    }
                </div>
            </div>
            <div>
                <ReviewForm 
                    locationID={locationID}
                    formType={reviewType}
                    setListLoading={setListLoading}
                />
            </div>
        </div>
    )
}