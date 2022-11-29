import React from "react";

export function Review(props) {


  return (

    <li>
      {props.review.description}
    </li>
  );
}

export function ReviewList(props) {
  let reviewComponents = props.reviews.map((eachReview) => {
    let singleReviewElem = <Review key={eachReview.id} review={eachReview.description} />
    return singleReviewElem;
  })

  return (
    <ol>
      {reviewComponents}
    </ol>
  )
}




// <Container className="page-container">
    //   <Card.Body>
    //     <Card.Title tag="h1">Reviews Page</Card.Title>
    //     <div className="reviews-top">
    //       <div className="user-details">
    //         <Card.Subtitle className="mb-2 text-muted" tag="h6">
    //           {/* {credentials.fname.charAt(0).toUpperCase() + credentials.fname.slice(1)}
    //           {credentials.lname.charAt(0).toUpperCase() + credentials.lname.slice(1) || "John Doe"} */}
    //           {}

    //         </Card.Subtitle>
    //         {/* {[...Array(stars || 5)].map((star) => {
    //           return <Card.Subtitle tag="h5">⭐ </Card.Subtitle>;
    //         })} */}
    //       </div>
    //       <div className="reviews-body">
    //         <Card.Text>
    //           {comment ||
    //             "Example comment"}
    //         </Card.Text>
    //       </div>
    //     </div>
    //   </Card.Body>
    // </Container>