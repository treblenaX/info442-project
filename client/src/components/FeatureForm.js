import { useContext, useState } from 'react';
import React from "react";
import { Button, Form } from 'react-bootstrap';
import ReviewService from '../services/ReviewService';
import { ReviewTypes } from '../constants/ReviewTypes';
import { CredentialsContext } from '../contexts/CredentialsContext';


export function ReviewForm(props) {
  const locationID = props.locationID;
  const formType = props.formType;

  const { credentials } = useContext(CredentialsContext);
  const [reviewText, setReviewText] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let payload;

      const base = {
        username: credentials.username,
        blurb: reviewText
      };

      console.log(formType);
      console.log(base);

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

      console.log(payload);
      if (!payload) {
        throw new Error('Null payload?');
      }
      
    } catch (e) {
      throw new Error('Something went wrong with posting a review... ' + e);
    }
  }

  return (
    <div>
      {
        (!credentials) // not logged in
        ?
        <div>
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
            <Form.Label>Write a review...</Form.Label>
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