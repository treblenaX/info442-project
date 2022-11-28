import React, { useContext, useState } from 'react'
import { Button, Form, Row, Container, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { CredentialsContext } from '../contexts/CredentialsContext';
import LoginService from '../services/LoginService';
import HeaderBar from '../components/HeaderBar';

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
                                <Col className="ps-5">
                                    <Form.Control 
                                        type="fname"
                                        placeholder='First Name'
                                        onChange={(e) => setFname(e.target.value)}
                                    ></Form.Control>
                                </Col>
                                <Col className="ps-3">
                                    <Form.Control 
                                        type="lname"
                                        placeholder='Last Name'
                                        onChange={(e) => setLname(e.target.value)}
                                    ></Form.Control>
                                </Col>

                            </Form.Group>
                            

                            <Form.Group size="lg" className="mb-3" as={Row}>
                                <Col 
                                    className="pe-5"
                                    xs={1}
                                >
                                    <Form.Label>
                                        <i className="bi bi-person-circle"></i>
                                    </Form.Label>
                                </Col>
                                <Col className="ps-0">
                                    <Form.Control 
                                        type="username" 
                                        placeholder="Enter your username..."
                                        onChange={(e) => setUsername(e.target.value)}
                                    ></Form.Control>
                                </Col>
                            </Form.Group>
                            <Form.Group size="lg" className="mb-3" as={Row}>
                                <Col 
                                    className="pe-5"
                                    xs={1}
                                >
                                    <Form.Label>
                                        <i className="bi bi-key-fill"></i>
                                    </Form.Label>
                                </Col>
                                <Col className='ps-0'>
                                    <Form.Control 
                                    type="password"
                                    placeholder="Enter your password..."
                                    onChange={(e) => setPassword(e.target.value)}
                                    ></Form.Control>
                                </Col>
                            </Form.Group>
                            <Form.Group size="lg" className="mb-3" as={Row}>
                                <Col 
                                    className="pe-5"
                                    xs={1}
                                >
                                    <Form.Label>
                                        <i className="bi bi-key-fill"></i>
                                    </Form.Label>
                                </Col>
                                <Col className='ps-0'>
                                    <Form.Control 
                                        type="password"
                                        placeholder="Confirm your password..."
                                        onChange={(e) => setPassword(e.target.value)}
                                    ></Form.Control>
                                </Col>
                            </Form.Group>
                            <Button type="submit" variant="primary">
                                Sign Up!
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