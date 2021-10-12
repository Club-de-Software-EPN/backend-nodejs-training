const AuthService = require("../services/Auth.service")

const authMiddleware = (response) => async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return response.error(res, 'Unathorized', 401);
        }
        const token = authorization.split(' ')[1];
        const authService = await AuthService.getInstance();
        const payload = authService.verifyToken(token);
        if (!payload) {
            return response.error(res, 'Unathorized', 401);
        }
        req.user = payload;
        next();
    } catch (e) {
        response.error(res, e.message, 401);
    }
}

module.exports = {
    authMiddleware
}