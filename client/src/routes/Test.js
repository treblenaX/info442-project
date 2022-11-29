import { useState } from 'react';
import React from "react";
import { AddReviewForm } from '../components/ReviewForm';
import { ReviewList } from '../components/ReviewList';
import '../styles/App.css';


function Test(props) {
  const [reviews, setReviews] = useState(props.reviews)

  const addReview = (reviewDescription) => {

    let newReview = {
      id: reviews.length + 1,
      description: reviewDescription
    }

    let updatedReviewArray = reviews.map((theReview) => {
      let reviewCopy = {...theReview}
      return reviewCopy;
    })

    updatedReviewArray.push(newReview);

    setReviews(updatedReviewArray)
  }

  return (
    <div className="container">
      <p className="lead">
        Building Reviews
      </p>
      <ReviewList reviews={props.reviews} />
      <AddReviewForm addReviewCallback={addReview} />
    </div>
  )
}
// export default function ReviewBody() {
//   // const {credentials, setCredentials} = useContext(CredentialsContext);
//   // const checkLogInStatus = async () => {
//   //     try {
//   //         const payload = await LoginService.heartbeat();
//   //         if (payload) {
//   //             setCredentials(payload);
//   //         }
//   //     } catch (e) {
//   //         toast.error('' + e)
//   //     }
//   // }
//   // useEffect(() => {
//   //     checkLogInStatus();
//   // }, [])
//   return (
//     <Container className="page-container">
//       <Row>
//         <Card.Title tag="h1">Reviews Page</Card.Title>
//         <div className="reviews-top">
//           <div className="user-details">
//             <Card.Subtitle className="mb-2 text-muted" tag="h6">
//               {/* {credentials.fname.charAt(0).toUpperCase() + credentials.fname.slice(1)}
//               {credentials.lname.charAt(0).toUpperCase() + credentials.lname.slice(1) || "John Doe"} */}
//               {}

//             </Card.Subtitle>
//             {/* {[...Array(stars || 5)].map((star) => {
//               return <Card.Subtitle tag="h5">⭐ </Card.Subtitle>;
//             })} */}
//           </div>
//           <div className="reviews-body">
//             <Card.Text>
//               {comment ||
//                 "Example comment"}
//             </Card.Text>
//           </div>
//         </div>
//       </Row>
//     </Container>
//   );
// }

export default Test;
