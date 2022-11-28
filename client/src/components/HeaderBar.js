import { useContext, useEffect, useState } from 'react';
import { Button, Nav, Navbar, Toast } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CredentialsContext } from '../contexts/CredentialsContext';
import LoginService from '../services/LoginService';
import { toast } from 'react-toastify';

export default function HeaderBar(props) { //Main bar containing logo, info popup, and user icon/picture
    const isHome = props.isHome;
    const {credentials, setCredentials} = useContext(CredentialsContext);
    const navigate = useNavigate();

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

    return(
        <Navbar expand={false} variant="dark">
            {
                (isHome)
                ?
                <Button 
                    variant="outlined"
                    className="m-auto clickable-button-look" 
                    style={{
                        color: '#EDFAFD',
                    }}
                ><i class="bi bi-info-circle-fill header-button"></i></Button>
                :
                <div className="m-auto"></div>
            }
            <Navbar.Brand className="m-auto d-inline-block align-top">
                <strong 
                    className="app-name-section m-auto clickable-button-look"
                    onClick={() => navigate('/')}
                >MAPABLE</strong>
            </Navbar.Brand>
            <Navbar.Toggle className="m-auto"/>
            <Navbar.Collapse className="m-auto">
                <Nav>
                    {
                        (credentials)
                        ?   // Signed in
                        <>
                            <Nav.Link>
                                { processFullName(credentials) }
                            </Nav.Link>
                            <Nav.Link 
                                href="/signout"
                            >
                                <h1>Sign Out</h1>
                            </Nav.Link>
                        </>
                        :   // Need to sign in
                        <>
                            <Nav.Link 
                                href="/login"
                            >
                                <h1>Log In</h1>
                            </Nav.Link>
                        </>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

const processFullName = (credentials) => {
    return (
        <p>
            Welcome, { credentials.fname.charAt(0).toUpperCase() + credentials.fname.slice(1) + ' ' + credentials.lname.charAt(0).toUpperCase() + credentials.lname.slice(1) }.
        </p>
    )
}