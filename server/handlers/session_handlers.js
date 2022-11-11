export const handleUserSessionStart = (req, user) => {
    const session = req.session;

    // Authenticate the user session
    session.username = user.username;
    session.isAuthenticated = true;
    
    session.save();
}

export const handleUserSessionEnd = (req) => req.session.destroy();