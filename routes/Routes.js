const UserController = require('../controllers/User.controller');
const AdministratorController = require('../controllers/Administrator.controller');
const AuthController = require('../controllers/Auth.controller');
const CourseController = require('../controllers/Course.controller');
const ReservationController = require('../controllers/Reservation.controller');

const routes = (server) => {
    server.use('/user', UserController);
    server.use('/administrator', AdministratorController);
    server.use('/auth', AuthController);
    server.use('/course', CourseController);
    server.use('/reservation', ReservationController);
}

module.exports = routes;
