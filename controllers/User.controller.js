const express = require('express');
const router = express.Router();

const UserService = require('../services/User.service');
const Console = require('../lib/Console');
const Response = require('../lib/Response');

const console = new Console('USER-CONTROLLER');
const userService = UserService.getInstance();
const response = new Response();

// get all users
router.get('/', (req, res) => {
    const users = userService.getAll();
    console.success('GET ALL USERS');
    response.success(res, users);
});

// get user by uuid
router.get('/:uuid', (req, res) => {
    const { uuid } = req.params;
    const user = userService.getOne(uuid);
    if (!user) {
        console.error('USER NOT FOUND: ' + uuid);
        response.error(res, 'USER NOT FOUND', 404);
        return;
    }
    console.success('GET USER: ' + uuid);
    response.success(res, user);
    return;
});

// create user
router.post('/', (req, res) => {
    const { name, lastName, email, phone, organization } = req.body;
    if (!name || !lastName || !email || !phone || !organization) {
        console.error('MISSING PARAMETERS');
        response.error(res, 'MISSING PARAMETERS', 400);
        return;
    }
    const user = userService.create(name, lastName, email, phone, organization);
    console.success('CREATE USER: ' + user.uuid);
    response.success(res, user);
});

// update user
router.put('/:uuid', (req, res) => {});

// delete user
router.delete('/:uuid', (req, res) => {});

// get reservations by user
router.get('/:uuid/reservations', (req, res) => {});

module.exports = router;
