import React, { useContext, useState } from 'react'
import { Button, Form, Row, Container, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { CredentialsContext } from '../contexts/CredentialsContext';
import LoginService from '../services/LoginService';
import HeaderBar from '../components/HeaderBar';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const navigate = useNavigate();
    const { setCredentials } = useContext(CredentialsContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [isLoggingIn, setLoggingIn] = useState(false);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            // ERROR - user is missing inputs
            if (!username || !password || !fname || !lname) throw new Error('The form is incomplete.');

            // ERROR - the passwords do not match
            if (password !== confirmPassword) throw new Error('The passwords do not match.');

            setLoggingIn(true);
    
            const form = {
                username: username,
                password: password,
                fname: fname,
                lname: lname
            };
    
            const payload = await LoginService.signup(form);

            toast.info('User successfully signed up and logged in!');
            setCredentials(payload);

            navigate('/');
        } catch (e) {
            toast.error('' + e.message);
        }
    }

    return (
        <div>
            <header>
                <HeaderBar 
                    isHome={false}
                />
            </header>
            <Container className="page-container">
                <Row>
                    <div className='page-item'>
                        <div>
                            <h1 className="mb-5">Sign Up</h1>
                        </div>
                        <Form onSubmit={handleSubmit}>

                            <Form.Group size="lg" className="mb-3" as={Row}>
                                <Col className="ps-3">
                                    <Form.Control 
                                        type="fname"
                                        placeholder='First Name'
                                        onChange={(e) => setFname(e.target.value.trim())}
                                    ></Form.Control>
                                </Col>
                                <Col className="ps-3">
                                    <Form.Control 
                                        type="lname"
                                        placeholder='Last Name'
                                        onChange={(e) => setLname(e.target.value.trim())}
                                    ></Form.Control>
                                </Col>

                            </Form.Group>
                            

                            <Form.Group size="lg" className="mb-3" as={Row}>
                                <Col className="ps-3">
                                    <Form.Control 
                                        type="username" 
                                        placeholder="Enter your username..."
                                        onChange={(e) => setUsername(e.target.value.trim())}
                                    ></Form.Control>
                                </Col>
                            </Form.Group>
                            <Form.Group size="lg" className="mb-3" as={Row}>
                                <Col className='ps-3'>
                                    <Form.Control 
                                    type="password"
                                    placeholder="Enter your password..."
                                    onChange={(e) => setPassword(e.target.value.trim())}
                                    ></Form.Control>
                                </Col>
                            </Form.Group>
                            <Form.Group size="lg" className="mb-3" as={Row}>
                                <Col className='ps-3'>
                                    <Form.Control 
                                        type="password"
                                        placeholder="Confirm your password..."
                                        onChange={(e) => setConfirmPassword(e.target.value.trim())}
                                    ></Form.Control>
                                </Col>
                            </Form.Group>
                            <Button type="submit" variant="primary">
                                { isLoggingIn ? 'Signing up...' : 'Sign up'}
                            </Button>
                        </Form>
                        <div className="page-item mt-4">
                            <p><em>Already have an account? <a href="/login">Login here!</a></em></p>
                        </div>
                    </div>
                </Row>
            </Container>

        </div>

    )
}