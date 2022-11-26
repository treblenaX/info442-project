export default HeaderBar;

function HeaderBar() { //Main bar containing logo, info popup, and user icon/picture
    return(
        <div class="header-bar">
            <div class="info-button-section header-bar-component">
                <button class="btn btn-light info-button"type="button"><strong>Info</strong></button>
            </div>

            <div class="app-name-section header-bar-component">
                <h1>
                    <strong>MAPABLE</strong>
                </h1>
            </div>
            
            <div class="login-button-section header-bar-component"> 
                <div></div>
                <button class="btn btn-light login-button" type="button login" value="login"><strong>Login</strong></button> 
            </div>
        </div>
    )
}