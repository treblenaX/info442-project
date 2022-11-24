import React, { useContext, useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { CredentialsContext } from '../contexts/CredentialsContext';
import LoginService from '../services/LoginService';

export default function Signup() {
    const { setCredentials } = useContext(CredentialsContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
    
            const form = {
                username: 'test',
                password: 'test123',
                fname: 'test',
                lname: 'testicles'
            };
    
            const payload = await LoginService.signup(form);

            setCredentials(payload);
        } catch (e) {
            toast.error('' + e.message);
        }
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