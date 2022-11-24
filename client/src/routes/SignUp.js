import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = {
            username: username,
            password: password
        };

        console.log(form);
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group size="lg" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                    type="username" 
                    placeholder="ex: echeng23"
                    onChange={(e) => setUsername(e.target.value)}
                ></Form.Control>
            </Form.Group>
            <Form.Group size="lg" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password"
                    placeholder="Enter your password..."
                    onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>
            <Form.Group size="lg" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                    type="password"
                    placeholder=""
                    onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary">
                Submit
            </Button>
        </Form>
    )
}