import express from 'express';
import User from '../entities/User.entity';

import Console from '../lib/Console';
import Response from '../lib/Response';
import { authMiddleware } from '../middlewares/Auth';
import ReservationService from '../services/Reservation.service';

const router = express.Router(); /* Maybe it is used to create */

const console = new Console('RESERVATION-CONTROLLER');
const response = new Response();

/**
 * @api {GET} /reservation Get all reservations
 * @apiName GetReservations
 * @apiGroup Reservations
 * @apiPermission administrator
 */
router.get('/', authMiddleware('administrator', response), async (req, res) => {
  try {
    const reservationService = await ReservationService.getInstance();
    const reservations = await reservationService.getAll();
    console.success('All reserservations have been getting');
    response.success(res, reservations);
  } catch (e) {
    console.error((e as Error).message);
    response.error(res, (e as Error).message);
  }
});

/**
 * @api {GET} /reservation:uuid Get one reservation
 * @apiName GetReservation
 * @apiGroup Reservations
 * @apiPermission administrator | user
 */
router.get('/:uuid', authMiddleware(['administrator', 'user'], response, true), async (req, res) => {
  try {
    const { uuid } = req.params;
    const authenticatedUser = req.body.user as User | undefined;
    if (!authenticatedUser?.reservations.find((reservation) => reservation.uuid === uuid)) {
      console.error(`User: ${authenticatedUser?.uuid} is not authorized to get this reservation: ${uuid}`);
      return response.error(res, 'User is not authorized to get this reservation', 401);
    }
    const reservationService = await ReservationService.getInstance();
    const reservation = await reservationService.getOne(uuid);
    if (!reservation) {
      console.error(`Reservation not found${uuid}`);
      return response.error(res, 'Reservation not found');
    }
    console.success(`Reservation found ${uuid}`);
    return response.success(res, reservation);
  } catch (e) {
    console.error((e as Error).message);
    return response.error(res, (e as Error).message);
  }
});

/**
 * @api {PUT} /reservation/:uuid update one reservation
 * @apiName UpdateReservations
 * @apiGroup Reservations
 * @apiPermission user
 * TODO: implement payment update logic.
 * Who have the permission to update reservation?
 */
router.put(
  '/:uuid',
  authMiddleware('user', response, true),
  (req, res) => {
    console.error('Not implemented');
    response.error(res, 'Not implemented');
  },
);

/**
 * @api {PUT} /reservation/:uuid delete one reservation
 * @apiName UpdateReservations
 * @apiGroup Reservations
 * @apiPermission user
 * TODO: implement payment update logic
 */
router.delete(
  '/:uuid',
  authMiddleware('user', response, true),
  async (req, res) => {
    try {
      const { uuid } = req.params;
      const authenticatedUser = req.body.user as User | undefined;
      if (!authenticatedUser?.reservations.find((reservation) => reservation.uuid === uuid)) {
        console.error(`User: ${authenticatedUser?.uuid} is not authorized to get this reservation: ${uuid}`);
        return response.error(res, 'User is not authorized to get this reservation', 401);
      }
      const reservationService = await ReservationService.getInstance();
      const reservation = await reservationService.delete(uuid);
      console.success(`Reservation deleted ${uuid}`);
      return response.success(res, reservation);
    } catch (e) {
      console.error((e as Error).message);
      return response.error(res, (e as Error).message);
    }
  },
);

export default router;
