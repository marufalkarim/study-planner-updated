const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    // In a production app, you would verify the Firebase token here using firebase-admin.
    // For this prototype, we will trust the client to send the UID in the 'Authorization' header
    // format: "Bearer <uid>"
    
    const token = authorization.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    req.user_id = token;
    next();
};

module.exports = requireAuth;
