import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ReviewService from '../services/ReviewService';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';

export function ReviewList(props) {
    const handleRefreshBuildingInfoModal = props.handleRefreshBuildingInfoModal;

    const locationID = props.locationID;
    const reviewType = props.reviewType;

    const [isListLoading, setListLoading] = useState(true);
    const [reviewCards, setReviewCards] = useState([]);
    const [sliceState, setSliceState] = useState([]);
    const [toggleMoreLoad, setToggleMoreLoad] = useState(false);

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
        if (isListLoading) {
            loadData()
                .catch((e) => {
                    toast.error('' + e.message);
                });
        }
    }, [isListLoading]);
  
    return (
        <div>
            <div>
                <div>
                    <ReviewForm 
                        locationID={locationID}
                        formType={reviewType}
                        handleSetListLoading={setListLoading}
                    />
                </div>
                <hr></hr>
                <div>
                    <p className='center-text'>This is what the community thinks about this location!</p>
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
                                <Button
                                    className="m-auto"
                                    onClick={() => setSliceState((prev) => {
                                        if (prev.length == 3) {
                                            setToggleMoreLoad(true);
                                            return reviewCards;
                                        }
                                        setToggleMoreLoad(false);
                                        return reviewCards.slice(0,3);
                                    })}
                                >
                                    {
                                        (!toggleMoreLoad)
                                        ? 'Load More Reviews'
                                        : 'Collapse Reviews'
                                    }
                                </Button>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}