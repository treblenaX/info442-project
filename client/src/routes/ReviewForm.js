import { useState } from 'react';
import React from "react";


export function AddReviewForm(props) {
  const [reviews, setReviews] = useState("");

  const handleChange = (e) => {
    let newReview = e.target.value;
    setReviews(newReview);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    props.addReviewCallback(reviews)
    console.log("Inputted: " + reviews)
    setReviews("");
  }

  console.log("rendering with", reviews)

  return (
          <form onSubmit={handleSubmit}>
            <input
              className="reviews-form"
              placeholder="enter your review"
              value={reviews}
              onChange={handleChange}
            />
            <button type="submit" style={{ background: "Green" }}>
              Submit
            </button>
          </form>
  );
}