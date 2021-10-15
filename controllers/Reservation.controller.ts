import express from 'express';

import Console from '../lib/Console';
import Response from '../lib/Response';
import ReservationService from '../services/Reservation.service';

const router = express.Router(); /* Maybe it is used to create */

const console = new Console('RESERVATION-CONTROLLER');
const response = new Response();

// getAllReservations
router.get('/', async (req, res) => {
  const reservationService = await ReservationService.getInstance();
  const reservations = await reservationService.getAll();
  console.success('All reserservations have been getting');
  response.success(res, reservations);
});

router.get('/:uuid', async (req, res) => {
  const { uuid } = req.params;
  const reservationService = await ReservationService.getInstance();
  const reservation = await reservationService.getOne(uuid);
  if (!reservation) {
    console.error(`Reservation not found${uuid}`);
    response.error(res, 'Reservation not found');
    return;
  }
  console.success(`Reservation found ${uuid}`);
  response.success(res, reservation);
});

// create a resevation !hard ＞﹏＜
router.post('/', async (req, res) => {

});

// Update Reservation Payment
router.put('/:uuid', (req, res) => { });

export default router;