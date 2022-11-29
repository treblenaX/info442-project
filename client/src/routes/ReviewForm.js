import React, { useState } from "react";
import { Button, Form, Input } from 'react-bootstrap';


export default function ReviewForm() {
  const [reviews, setReviews] = useState("");
  const onChange = (e) => {
    setReviews(e.target.value);
  };
  const onSubmit = (e) => {
    console.log("Form Submitted");
  };

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit}>
        <Input
          className="reviews-form"
          type="text"
          placeholder="enter your review"
          value={reviews}
          onChange={onChange}
        />
        <Button type="submit" style={{ background: "Green" }}>
          Submit
        </Button>
      </Form>
    </div>
  );
}