const express = require('express');
const router = express.Router();

const UserService = require('../services/User.service');
const Console = require('../lib/Console');
const Response = require('../lib/Response');

const console = new Console('USER-CONTROLLER');
const userService = UserService.getInstance();
const response = new Response();

router.post('/', (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return response.error(res, 'Email is required', 400);
    }
    if (!password) {
        return response.error(res, 'Password is required', 400);
    }
    const isLoggedIn = userService.login(email, password);
    if (!isLoggedIn) {
        return response.error(res, 'Invalid email or password', 400);
    }
    console.success('User authenticated: ' + email);
    return response.success(res, 'User Logged in', 200);
});

module.exports = router;
