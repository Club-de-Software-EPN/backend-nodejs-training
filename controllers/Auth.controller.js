const express = require('express');
const router = express.Router();

const Console = require('../lib/Console');
const Response = require('../lib/Response');
const AuthService = require('../services/Auth.service');

const console = new Console('AUTH-CONTROLLER');
const response = new Response();

router.post('/user', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return response.error(res, 'Email and password are required');
        }
        const authService = await AuthService.getInstance();
        const isLoggedIn = await authService.userLogin(email, password);
        response.success(res, isLoggedIn);
    } catch(error) {
        console.error(error);
        response.error(res, error.message);
    }
});

router.post('/administrator', () => {})

module.exports = router;
