import express, { NextFunction, Request, Response as ExpressResponse } from 'express';
import { AnyObjectSchema } from 'yup';

import UserService from '../services/User.service';
import { createUser, updateUser } from '../dtos/User.dto';
import Console from '../lib/Console';
import Response from '../lib/Response';
import { authMiddleware } from '../middlewares/Auth';

const router = express.Router();
const console = new Console('USER-CONTROLLER');
const response = new Response();

const validationMiddleware = (schema: AnyObjectSchema) => async (req: Request, res: ExpressResponse, next: NextFunction) => {
  try {
    await schema.validate({
      body: req.body,
    });
    next();
    return;
  } catch (error) {
    console.error((error as Error)?.message);
    response.error(res, (error as Error)?.message, 400);
  }
};

// get all users
router.get('/', async (req, res) => {
  try {
    const userService = await UserService.getInstance();
    const users = await userService.getAll();
    console.success('GET ALL USERS');
    response.success(res, users);
  } catch (error) {
    console.error((error as Error)?.message);
    response.error(res, (error as Error)?.message, 500);
  }
});

// get user by uuid
router.get('/:uuid', async (req, res) => {
  try {
    const userService = await UserService.getInstance();
    const { uuid } = req.params;
    const user = await userService.getOne(uuid);
    if (!user) {
      console.error(`USER NOT FOUND: ${uuid}`);
      response.error(res, 'USER NOT FOUND', 404);
      return;
    }
    console.success(`GET USER: ${uuid}`);
    response.success(res, user);
    return;
  } catch (error) {
    console.error((error as Error)?.message);
    response.error(res, (error as Error)?.message, 500);
  }
});

// create user
router.post(
  '/',
  authMiddleware(response),
  validationMiddleware(createUser),
  async (req, res) => {
    console.success(req.body?.user);
    const {
      name, lastName, email, phone, organization, password,
    } = req.body;
    const userService = await UserService.getInstance();
    const user = await userService.create(name, lastName, email, phone, organization, password);
    console.success(`CREATE USER: ${user.uuid}`);
    response.success(res, user);
  },
);

// update user
router.put('/:uuid', validationMiddleware(updateUser), async (req, res) => {
  try {
    const { uuid } = req.params;
    const userService = await UserService.getInstance();
    const {
      email, name, lastName, phone, organization, password,
    } = req.body;
    const userUpdated = await userService.update(
      uuid,
      email,
      name,
      lastName,
      phone,
      organization,
      password,
    );
    console.success(`User updated: ${uuid}`);
    return response.success(res, userUpdated, 200);
  } catch (error) {
    console.error((error as Error)?.message);
    return response.error(res, (error as Error)?.message, 500);
  }
});

// delete user
router.delete('/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    if (!uuid) {
      return response.error(res, 'Data Missing', 400);
    }
    const userService = await UserService.getInstance();
    const userDeleted = await userService.delete(uuid);
    console.success(`User deleted: ${uuid}`);
    response.success(res, userDeleted);
  } catch (error) {
    console.error((error as Error)?.message);
    return response.error(res, (error as Error)?.message, 500);
  }
});

// get reservations by user
router.get('/:uuid/reservations', async (req, res) => {
  try {
    const { uuid } = req.params;
    if (!uuid) {
      return response.error(res, 'Data missing', 400);
    }
    const userSevice = await UserService.getInstance();
    const userReservations = await userSevice.getReservations(uuid);
    if (userReservations === null) {
      console.success('User has no reservations');
      return response.success(res, 'User has no reservations');
    }
    console.success(`Reservations of: ${uuid}`);
    response.success(res, userReservations);
  } catch (error) {
    console.error((error as Error)?.message);
    return response.error(res, (error as Error)?.message, 500);
  }
});

export default router;
