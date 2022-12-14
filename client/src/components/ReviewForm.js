import { useContext, useState } from 'react';
import React from "react";
import { Button, Form } from 'react-bootstrap';
import ReviewService from '../services/ReviewService';
import { ReviewTypes } from '../constants/ReviewTypes';
import { CredentialsContext } from '../contexts/CredentialsContext';
import { toast } from 'react-toastify';


export function ReviewForm(props) {
  const locationID = props.locationID;
  const formType = props.formType;
  const handleSetListLoading = props.handleSetListLoading;

  const { credentials } = useContext(CredentialsContext);
  const [reviewText, setReviewText] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      let payload;

      const base = {
        username: credentials.username,
        blurb: reviewText
      };

      switch (formType) {
        case ReviewTypes.BUILDING:
          payload = await ReviewService.postReview({
            ...base,
            location_id: locationID,
          });
          break;
        case ReviewTypes.FEATURE:
          break;
      }
      if (!payload) {
        throw new Error('Null payload?');
      }

      // Refresh the display list
      handleSetListLoading(true);
      toast.dismiss();
      toast.info('Review has been posting!');
      setLoading(false);
    } catch (e) {
      throw new Error('Something went wrong with posting a review... ' + e);
    }
  }

  return (
    <div>
      {
        (!credentials) // not logged in
        ?
        <div className="center-text">
          <em>Please log in to post a review...</em>
        </div>
        :
        <Form
          onSubmit={handleSubmit}
        >
          <Form.Group 
            className="mb-3"
            controlId="review_text_area"
          >
            <Form.Label className="center-text">
              Can you tell us about your accessibility experience at this building?
            </Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              onChange={(e) => setReviewText(e.target.value)}
            />
          </Form.Group>
          <Button 
            type="submit" 
            variant="primary"
          >
            { isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </Form>
      }
    </div>
  );
}