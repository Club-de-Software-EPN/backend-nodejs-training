import { Express } from 'express';

import UserController from '../controllers/User.controller';
import AdministratorController from '../controllers/Administrator.controller';
import AuthController from '../controllers/Auth.controller';
import CourseController from '../controllers/Course.controller';
import ReservationController from '../controllers/Reservation.controller';

const routes = (server: Express) => {
  server.use('/user', UserController);
  server.use('/administrator', AdministratorController);
  server.use('/auth', AuthController);
  server.use('/course', CourseController);
  server.use('/reservation', ReservationController);
};

export default routes;
