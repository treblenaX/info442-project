import React from "react";
import { Card } from "react-bootstrap";
import '../styles/Review.css';

export function ReviewCard(props) {
  const review = props.payload;

  return (
    <Card className="review-card m-auto">
      <Card.Header><strong>{`@${review.username} - ${new Date(review.timestamp).toLocaleString()}`}</strong></Card.Header>
      <Card.Body>
        <Card.Title></Card.Title>
        <Card.Text>
          {review.blurb}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
