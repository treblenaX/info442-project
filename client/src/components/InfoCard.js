import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

export default function InfoCard() {
    const infoCard = (
    <Popover id="popover-basic">
        <Popover.Header as="h3">

        <strong>Face Rating Icons</strong>
        <img
              className="d-block w-100"
              src={require('../images/FaceRatingIcons.png')}
              alt="Face Rating Icon Diagram"
            />
        <p></p>
        <strong>Accessibility Feature Icons</strong>
          <img
              className="d-block w-100"
              src={require('../images/AccessibilityIcons.png')}
              alt="Accessibility Features Icon Diagram"
            />
            
        </Popover.Header>
        <Popover.Body>
          <div className='pop-up'>
            <p> Each face icon represent a building's average rating out of 3.The red upset face is an average rating of 1 (or poor). The yellow neutral face face mean that a building has received an average rating of 2 (or okay). Lastly, the green happy face means that a building has received an average of 3 (or great).</p>
            
            <p></p>
            
            <p>These icons will help you find accessibility features more easily during your commute. The doors icon represents automatic doors. The "E" icon represents elevators. The wheel chair person represenets ramps.</p>
          </div>  
        </Popover.Body>
      </Popover>
    );

  return (
    <OverlayTrigger trigger="click" placement="bottom" overlay={infoCard}>
        <Button 
        variant="outlined"
        className="m-auto clickable-button-look" 
        style={{
            color: '#EDFAFD',
        }}
    ><i className="bi bi-info-circle-fill header-button"></i></Button>
    </OverlayTrigger>
  );

  
}

