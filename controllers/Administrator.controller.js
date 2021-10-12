const e = require('express');
const express = require('express');
const router = express.Router();

const { createAdministrator, updateAdministrator} = require('../dtos/Administrator.dto');
const Console = require('../lib/Console');
const Response = require('../lib/Response');
const AdministratorService = require('../services/Administrator.service');

const console = new Console('ADMIN-CONTROLLER');
const response = new Response();



const validationMiddleware = (schema) =>  async (req, res, next) => {
    try {
        await schema.validate({
            body: req.body,
        });
        next();
        return;
    } catch(error) {
        console.error(error);
        response.error(res, error, 400);
    }
}

//CREATE
router.post('/', validationMiddleware(createAdministrator), async (req, res) => {
    const {name, lastName, email, password} = req.body;
    const administratorService = await AdministratorService.getInstance()
    const administrator = await administratorService.create(name,lastName,email,password);
    console.success("Administrador created: " + administrator.id);
    response.success(res,administrator);

});

//READ
// getAll
router.get('/', async (req, res) => {
    try {
        const  administratorService = await AdministratorService.getInstance();
        const adminstrators = await administratorService.getAll();
        console.success('Get all administrators')
        response.success(res,adminstrators);
    } catch (error) {
        console.error(error.message);
    }
});
// getById
router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const administratorService = await AdministratorService.getInstance();
        const administrator = await administratorService.getOne(id);
        if(!administrator){
            console.error("Administrator not found");
            response.error(res,"Administrator not found",400);
            return;
        }
        console.success("Get administrator" + id);
        response.success(res, administrator);
        return;
    } catch (error) {
        console.error(error.message);
    }
});


//UPDATE
router.put('/:id', async (req, res) => {
    
    const id = req.params.id;
    const {name, lastName, email, password} = req.body;
    const administratorService = await AdministratorService.getInstance();
    const administratorUpdated = await administratorService.update(id,name, lastName, email, password);
    console.success("Administrator Updated: " + administratorUpdated.id);
    response.success(res, administratorUpdated);
    
});

//DELETE
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if(!id){
            console.error("Missing parameters");
            response.error(res, "Missing parameters", 400);
            return;
        }
        const administratorService = await AdministratorService.getInstance();
        const administratorDeleted = await administratorService.delete(id);
        console.success("Admininstrator deleted" + administratorDeleted.id);
        response.success(res, administratorDeleted)
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;
