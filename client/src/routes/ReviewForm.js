import React, { useState } from "react";
import { Button, Form, Input } from "reactstrap";


export default function ReviewForm() {
  const [reviews, setReviews] = useState("");
  const onChange = (e: any) => {
    setReviews(e.target.value);
  };
  const onSubmit = (e: any) => {
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