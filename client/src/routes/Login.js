import React, { useContext, useState } from 'react'
import { 
    Button, 
    Container, 
    Form, 
    Row, 
    Col 
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CredentialsContext } from '../contexts/CredentialsContext';
import LoginService from '../services/LoginService';

export default function Login() {
    const navigate = useNavigate();
    const { setCredentials } = useContext(CredentialsContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
    
            const form = {
                username: username,
                password: password
            };
    
            const payload = await LoginService.login(form);

            // When user data is loaded, set it.
            setCredentials(payload);

            // Announce and navigate back to the home page
            toast.info('Successfully logged in!');
            toast.info(`Welcome, ${payload.fname}.`);
            navigate('/');
        } catch (e) {
            toast.error('' + e.message);
        }
    }

    return (
        <Container className="page-container">
            <Row>
                <div className="page-item">
                    <div>
                        <h1 className="mb-5">Log In</h1>
                    </div>
                    <Form 
                        onSubmit={handleSubmit}
                        className="page-item"
                    >
                        <Form.Group 
                            size="lg" 
                            className="mb-1"
                            as={Row}
                        >
                            <Col 
                                className="pe-0"
                                xs={2}
                            >
                                <Form.Label>
                                    <i className="bi bi-person-circle"></i>
                                </Form.Label>
                            </Col>
                            <Col className="ps-1">
                                <Form.Control 
                                    type="username" 
                                    placeholder="ex: echeng23"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group 
                            size="lg" 
                            className="mb-1"
                            as={Row}
                        >
                            <Col 
                                className="pe-0"
                                xs={2}
                            >
                                <Form.Label>
                                    <i className="bi bi-key-fill"></i>
                                </Form.Label>
                            </Col>
                            <Col className="ps-1">
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
                    <div className="page-item mt-4">
                        <p><em>Don't have an account? Please sign up <a href="/signup">here!</a></em></p>
                    </div>
                </div>
            </Row>
        </Container>
    )
}