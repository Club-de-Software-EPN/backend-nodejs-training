const UserController = require('../controllers/User.controller');

const routes = (server) => {
    server.use('/users', UserController);
}

module.exports = routes;
