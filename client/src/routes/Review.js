import { useContext, useEffect, useState } from 'react';
import React from "react";
import Card from "react-bootstrap";
import { CredentialsContext } from '../contexts/CredentialsContext';
import LoginService from '../services/LoginService';

export default function ReviewBody() {
  const {credentials, setCredentials} = useContext(CredentialsContext);
  const checkLogInStatus = async () => {
      try {
          const payload = await LoginService.heartbeat();
          if (payload) {
              setCredentials(payload);
          }
      } catch (e) {
          toast.error('' + e)
      }
  }
  useEffect(() => {
      checkLogInStatus();
  }, [])
  return (
    <Card>
      <Card.Body>
        <Card.Title tag="h1">Reviews Page</Card.Title>
        <div className="reviews-top">
          <div className="user-details">
            <Card.Subtitle className="mb-2 text-muted" tag="h6">
              {credentials.fname.charAt(0).toUpperCase() + credentials.fname.slice(1)}
              {credentials.lname.charAt(0).toUpperCase() + credentials.lname.slice(1) || "John Doe"}
            </Card.Subtitle>
            {[...Array(stars || 5)].map((star) => {
              return <Card.Subtitle tag="h5">⭐ </Card.Subtitle>;
            })}
          </div>
          <div className="reviews-body">
            <Card.Text>
              {comment ||
                "Example comment"}
            </Card.Text>
          </div>
          <Card.Text>
            <small className="text-muted text-bold">
              {timestamp || "3 mins ago"}
            </small>
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
}

