const express = require('express');
const router = express.Router();

const Console = require('../lib/Console');
const Response = require('../lib/Response');

const console = new Console('COURSE-CONTROLLER');
const response = new Response();

// get all courses
router.get('/', (req, res) => {});

// get course by id
router.get('/:slug', (req, res) => {});

// add new course
router.post('/', (req, res) => {});

// delete course
router.delete('/:slug', (req, res) => {});

//update course
router.put('/:slug', (req, res) => {});

// get all reservations
router.get('/:slug/reservations', (req, res) => {});

// create new reservation
// body: { uuid }
router.post('/:slug/reservate/', () => {});

module.exports = router;
