import React, { useEffect, useState } from 'react';
import '../styles/Loading.css';
import { Spinner } from 'react-bootstrap';
import {
    Container,
    Row,
    Col
} from 'react-bootstrap';
import { LOADING_TEXTS } from '../constants/LoadingTexts';

const MS_SECOND = 1000;

export default function DisplayLoading() {
    const [loadingText, setLoadingText] = useState(() => {
        const index = Math.round((Math.random() * LOADING_TEXTS.length));
        return {
            index: index,
            text: LOADING_TEXTS[index]
        }
    });


    useEffect(() => {
        if (document.body.style.overflow != 'hidden') {
            // Lock the scrolling ability
            document.body.style.overflow = 'hidden';
        }
        const loadingInterval = setInterval(() => {
            setLoadingText((prev) => {
                let newIndex = Math.round((Math.random() * LOADING_TEXTS.length));
        
                // Find index that hasn't been used...
                while (prev.index == newIndex || newIndex >= LOADING_TEXTS.length) {
                    newIndex = Math.round((Math.random() * LOADING_TEXTS.length))
                }
                return {
                    index: newIndex,
                    text: LOADING_TEXTS[newIndex]
                };
            })
        }, MS_SECOND * 2);

        // On destroy -> unlock scrolling ability
        return () => {
            document.body.style.overflow = 'unset';
            clearInterval(loadingInterval);
        }
    }, []);

    return (
        <Container className="loading-container" fluid={true}>
            <div className="loading-item"></div>
            <Row className="loading-item">
                <Col className="spinner-container">
                    <div className="spinner-item">
                        <Spinner animation="border" role="status" style={{ width: '4rem', height: '4rem' }}>
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                    <div className="spinner-item">
                        <h1>{ loadingText.text }</h1>
                    </div>
                </Col>
            </Row>
            <div className="loading-item"></div>
        </Container>
    );

}