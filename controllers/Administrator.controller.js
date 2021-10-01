const express = require('express');
const router = express.Router();

const Console = require('../lib/Console');
const Response = require('../lib/Response');

const console = new Console('ADMIN-CONTROLLER');
const response = new Response();

//CREATE
router.post('/', (req, res) => {});

//READ
// getAll
router.get('/', (req, res) => {});
// getById
router.get('/:id', (req, res) => {});


//UPDATE
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const {name, latName, email} = req.body;
});

//DELETE
router.delete('/:id', (req, res) => {
    const id = req.params.id;
});

module.exports = router;
