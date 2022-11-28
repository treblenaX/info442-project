export const handleUserSessionStart = (req, user) => {
    const session = req.session;

    // Authenticate the user session
    session.user = user;
    session.isAuthenticated = true;
    
    session.save();
}

export const handleUserSessionEnd = (req) => req.session.destroy();

export const checkUserLoggedIn = () => req.session.cookie && req.session.isAuthenticated;