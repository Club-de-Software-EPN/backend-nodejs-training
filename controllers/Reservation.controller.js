const express = require('express');
const router = express.Router();

const Console = require('../lib/Console');
const Response = require('../lib/Response');

const console = new Console('RESERVATION-CONTROLLER');
const response = new Response();

// getAllReservations
router.get('/', (req, res) => {});

// Update Reservation Payment
router.put('/:uuid', (req, res) => {});

module.exports = router;
