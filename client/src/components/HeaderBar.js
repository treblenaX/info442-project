import { useEffect } from 'react';
import { Button, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function HeaderBar(props) { //Main bar containing logo, info popup, and user icon/picture
    const isHome = props.isHome;
    const navigate = useNavigate();

    return(
        <Navbar>
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
            <Navbar.Brand className="m-auto">
                <strong 
                    className="app-name-section m-auto clickable-button-look"
                    onClick={() => navigate('/')}
                >MAPABLE</strong>
            </Navbar.Brand>
            {
                (isHome)
                ?
                <Button 
                    variant="outlined"
                    className="header-button clickable-button-look user-icon"
                    style={{
                        color: '#EDFAFD',
                        marginLeft: '20px'
                    }}
                    onClick={() => navigate('/login')}
                >    
                    <i 
                        className="bi bi-person-circle ml-2 m-auto user-icon"
                    ></i>
                </Button>
                :
                <div className="m-auto"></div>
            }
        </Navbar>
    )
}