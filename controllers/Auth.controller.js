const express = require('express');
const router = express.Router();

const Console = require('../lib/Console');
const Response = require('../lib/Response');

const console = new Console('AUTH-CONTROLLER');
const response = new Response();

router.post('/user', () => {});

router.post('/administrator', () => {})

module.exports = router;
