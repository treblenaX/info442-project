import React, { useState } from 'react'
import { Button, Container, Form, Row, Col } from 'react-bootstrap';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = {
            username: username,
            password: password
        };

        console.log(form);
    }

    return (
        <Container className="page-container">
            <Row>
                <div className="page-item">
                    <div>
                        <h1>Log In</h1>
                    </div>
                    <Form 
                        onSubmit={handleSubmit}
                        className="page-item"
                    >
                        <Form.Group 
                            size="lg" 
                            className="mb-4"
                            as={Row}
                        >
                            <Col xs={2}>
                                <Form.Label>
                                    <i class="bi bi-person-circle"></i>
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control 
                                    type="username" 
                                    placeholder="ex: echeng23"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group 
                            size="lg" 
                            className="mb-3"
                            as={Row}
                        >
                            <Col xs={2}>
                                <Form.Label>
                                    <i class="bi bi-key-fill"></i>
                                </Form.Label>
                            </Col>
                            <Col>
                                <Form.Control 
                                    type="password"
                                    placeholder="Enter your password..."
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Col>
                        </Form.Group>
                        <Button 
                            type="submit" 
                            variant="primary"
                        >
                            Login
                        </Button>
                    </Form>
                </div>
            </Row>
        </Container>
    )
}