const express = require('express');
const router = express.Router();

const UserService = require('../services/User.service');
const Console = require('../lib/Console');
const Response = require('../lib/Response');

const console = new Console('USER-CONTROLLER');
const response = new Response();

// get all users
router.get('/', async (req, res) => {
    const userService = await UserService.getInstance();
    const users = await userService.getAll();
    console.success('GET ALL USERS');
    response.success(res, users);
});

// get user by uuid
router.get('/:uuid', async (req, res) => {
    const userService = await UserService.getInstance();
    const { uuid } = req.params;
    const user = await userService.getOne(uuid);
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
router.post('/', async (req, res) => {
    const { name, lastName, email, phone, organization, password } = req.body;
    if (!name || !lastName || !email || !phone || !organization || !password) {
        console.error('MISSING PARAMETERS');
        response.error(res, 'MISSING PARAMETERS', 400);
        return;
    }
    const userService = await UserService.getInstance();
    const user = await userService.create(name, lastName, email, phone, organization, password);
    console.success('CREATE USER: ' + user.uuid);
    response.success(res, user);
});

// update user
router.put('/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        if (!uuid) {
            return response.error(res, 'Data missing', 400);
        }
        const userService = await UserService.getInstance();
        const { email, name, lastName, phone, organization, password } = req.body;
        await userService.update(uuid, email, name, lastName, phone, organization, password);
        console.success('User updated: ' + uuid);
        return response.success(res, 'User updated', 200);
    } catch (error) {
        console.error(error);
        if (err instanceof SequelizeDatabaseError) {
            response.error(res, err.message, 404);
        }
        return response.error(res, error.message, 500);
    }
});

// delete user
router.delete('/:uuid', (req, res) => {});

// get reservations by user
router.get('/:uuid/reservations', (req, res) => {});

module.exports = router;
