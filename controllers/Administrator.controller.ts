import express from 'express';

import { createAdministrator, updateAdministrator } from '../dtos/Administrator.dto';
import Console from '../lib/Console';
import Response from '../lib/Response';
import AdministratorService from '../services/Administrator.service';
import { validationMiddleware } from '../middlewares/Validation';
import { authMiddleware } from '../middlewares/Auth';
import Administrator from '../entities/Administrator.entity';

const router = express.Router();

const apiConsole = new Console('ADMIN-CONTROLLER');
const response = new Response();

/**
 * @api {POST} /administrator create Administrator
 * @apiName createAdministrator
 * @apiGroup Administrator
 * @apiPermission administrator
 */
router.post(
  '/',
  authMiddleware('administrator', response),
  validationMiddleware(createAdministrator, response),
  async (req, res) => {
    try {
      const {
        name, lastName, email, password,
      } = req.body;
      const administratorService = await AdministratorService.getInstance();
      console.log(administratorService);
      const administrator = await administratorService.create(name, lastName, email, password);
      apiConsole.success(`Administrador created: ${administrator.id}`);
      response.success(res, administrator);
    } catch (error) {
      apiConsole.error((error as Error).message);
      console.error((error as Error).message);
      response.error(res, (error as Error).message);
    }
  },
);

/**
 * @api {GET} /administrator Get all Administrators
 * @apiName getAllAdministrators
 * @apiGroup Administrator
 * @apiPermission administrator
 */
router.get(
  '/',
  authMiddleware('administrator', response),
  async (req, res) => {
    try {
      const administratorService = await AdministratorService.getInstance();
      const adminstrators = await administratorService.getAll();
      apiConsole.success('Get all administrators');
      response.success(res, adminstrators);
    } catch (error) {
      apiConsole.error((error as Error)?.message);
      response.error(res, (error as Error)?.message, 400);
    }
  },
);

/**
 * @api {GET} /administrator/:id Get one Administrator
 * @apiName getOneAdministrator
 * @apiGroup Administrator
 * @apiPermission administrator
 */
router.get(
  '/:id',
  authMiddleware('administrator', response),
  async (req, res) => {
    try {
      const { id } = req.params;
      const administratorService = await AdministratorService.getInstance();
      const administrator = await administratorService.getOne(Number(id));
      if (!administrator) {
        apiConsole.error('Administrator not found');
        response.error(res, 'Administrator not found', 400);
        return;
      }
      apiConsole.success(`Get administrator${id}`);
      response.success(res, administrator);
      return;
    } catch (error) {
      apiConsole.error((error as Error)?.message);
    }
  },
);

/**
 * @api {PUT} /administrator/:id Update Administrator
 * @apiName UpdateAdministrator
 * @apiGroup Administrator
 * @apiPermission administrator
 */
router.put(
  '/:id',
  authMiddleware('administrator', response, true),
  validationMiddleware(updateAdministrator, response),
  async (req, res) => {
    try {
      const { id } = req.params;
      const authenticatedAdministrator = req.body.administrator as Administrator;
      if (authenticatedAdministrator.id !== Number(id)) {
        apiConsole.error('Administrator not found');
        return response.error(res, 'Administrator not found', 400);
      }
      const {
        name, lastName, email, password,
      } = req.body;
      const administratorService = await AdministratorService.getInstance();
      const administratorUpdated = await administratorService.update(
        Number(id),
        name,
        lastName,
        email,
        password,
      );
      apiConsole.success(`Administrator Updated: ${administratorUpdated.id}`);
      return response.success(res, administratorUpdated);
    } catch (error) {
      apiConsole.error((error as Error)?.message);
      return response.error(res, (error as Error)?.message, 400);
    }
  },
);

/**
 * @api {DELETE} /administrator/:id Delete Administrator
 * @apiName deleteAdministrator
 * @apiGroup Administrator
 * @apiPermission administrator
 */
router.delete(
  '/:id',
  authMiddleware('administrator', response, true),
  async (req, res) => {
    try {
      const { id } = req.params;
      const authenticatedAdministrator = req.body.administrator as Administrator;
      if (authenticatedAdministrator.id !== Number(id)) {
        apiConsole.error('Administrator not found');
        return response.error(res, 'Administrator not found', 400);
      }
      const administratorService = await AdministratorService.getInstance();
      const administratorDeleted = await administratorService.delete(Number(id));
      apiConsole.success(`Admininstrator deleted${administratorDeleted.id}`);
      return response.success(res, administratorDeleted);
    } catch (error) {
      apiConsole.error((error as Error)?.message);
      return response.error(res, (error as Error)?.message, 400);
    }
  },
);

export default router;
