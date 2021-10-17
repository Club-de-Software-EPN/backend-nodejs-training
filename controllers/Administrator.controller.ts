import express from 'express';

import { createAdministrator, updateAdministrator } from '../dtos/Administrator.dto';
import Console from '../lib/Console';
import Response from '../lib/Response';
import AdministratorService from '../services/Administrator.service';
import { authMiddleware } from '../middlewares/Auth';

const router = express.Router();

const apiConsole = new Console('ADMIN-CONTROLLER');
const response = new Response();

const validationMiddleware = (schema: any) => async (req: any, res: any, next: any) => {
  try {
    await schema.validate({
      body: req.body,
    });
    next();
    return;
  } catch (error) {
    apiConsole.error((error as Error)?.message);
    response.error(res, (error as Error)?.message, 400);
  }
};

// CREATE
router.post('/', authMiddleware(response), validationMiddleware(createAdministrator), async (req, res) => {
  const {
    name, lastName, email, password,
  } = req.body;
  const administratorService = await AdministratorService.getInstance();
  const administrator = await administratorService.create(name, lastName, email, password);
  apiConsole.success(`Administrador created: ${administrator.id}`);
  response.success(res, JSON.stringify(administrator));
});

// READ
// getAll
router.get('/', async (req, res) => {
  try {
    const administratorService = await AdministratorService.getInstance();
    const adminstrators = await administratorService.getAll();
    apiConsole.success('Get all administrators');
    response.success(res, adminstrators.toString());
  } catch (error) {
    apiConsole.error((error as Error)?.message);
    response.error(res, (error as Error)?.message, 400);
  }
});
// getById
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const administratorService = await AdministratorService.getInstance();
    const administrator = await administratorService.getOne(+id);
    if (!administrator) {
      apiConsole.error('Administrator not found');
      response.error(res, 'Administrator not found', 400);
      return;
    }
    apiConsole.success(`Get administrator${id}`);
    response.success(res, JSON.stringify(administrator));
    return;
  } catch (error) {
    apiConsole.error((error as Error)?.message);
  }
});

// UPDATE
router.put('/:id', authMiddleware(response), validationMiddleware(updateAdministrator), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, lastName, email, password,
    } = req.body;
    const administratorService = await AdministratorService.getInstance();
    const administratorUpdated = await administratorService.update(
      +id,
      name,
      lastName,
      email,
      password,
    );
    apiConsole.success(`Administrator Updated: ${administratorUpdated.id}`);
    response.success(res, JSON.stringify(administratorUpdated));
  } catch (error) {
    apiConsole.error((error as Error)?.message);
    response.error(res, (error as Error)?.message, 400);
  }
});

// DELETE
router.delete('/:id', authMiddleware(response), async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      apiConsole.error('Missing parameters');
      response.error(res, 'Missing parameters', 400);
      return;
    }
    const administratorService = await AdministratorService.getInstance();
    const administratorDeleted = await administratorService.delete(+id);
    apiConsole.success(`Admininstrator deleted${administratorDeleted.id}`);
    response.success(res, JSON.stringify(administratorDeleted));
  } catch (error) {
    apiConsole.error((error as Error)?.message);
    response.error(res, (error as Error)?.message, 400);
  }
});

export default router;
