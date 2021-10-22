import express from 'express';

import UserService from '../services/User.service';
import { createUser, updateUser } from '../dtos/User.dto';
import Console from '../lib/Console';
import Response from '../lib/Response';
import { authMiddleware } from '../middlewares/Auth';
import { validationMiddleware } from '../middlewares/Validation';
import User from '../entities/User.entity';

const router = express.Router();
const console = new Console('USER-CONTROLLER');
const response = new Response();

/**
 * @api {GET} /users Get all users
 * @apiName GetUsers
 * @apiGroup User
 * @apiPermission administrator
 */
router.get('/', authMiddleware('administrator', response), async (req, res) => {
  try {
    const userService = await UserService.getInstance();
    const users = await userService.getAll();
    console.success('GET /user');
    response.success(res, users);
  } catch (error) {
    console.error((error as Error)?.message);
    response.error(res, (error as Error)?.message, 500);
  }
});

/**
 * @api {GET} /users/:uuid Get one users
 * @apiName GetUser
 * @apiGroup User
 * @apiPermission administrator | user
 */
router.get('/:uuid',
  authMiddleware(['user', 'administrator'], response, true),
  async (req, res) => {
    try {
      const { uuid } = req.params;
      if (!req.body.administrator) {
        const authenticatedUser = req.body?.user as User;
        if (authenticatedUser?.uuid !== uuid) {
          return response.error(res, 'Unauthorized', 401);
        }
      }
      const userService = await UserService.getInstance();
      const user = await userService.getOne(uuid);
      if (!user) {
        console.error(`USER NOT FOUND: ${uuid}`);
        return response.error(res, 'USER NOT FOUND', 404);
      }
      console.success(`GET USER: ${uuid}`);
      return response.success(res, user);
    } catch (error) {
      console.error((error as Error)?.message);
      return response.error(res, (error as Error)?.message, 500);
    }
  });

/**
 * @api {GET} /users/:uuid/reservations Get all user reservations
 * @apiName GetUserReservations
 * @apiGroup User
 * @apiPermission administrator | user
 */
router.get('/:uuid/reservations',
  authMiddleware(['user', 'administrator'], response, true),
  async (req, res) => {
    try {
      const { uuid } = req.params;
      if (!req.body.administrator) {
        const authenticatedUser = req.body?.user as User;
        if (authenticatedUser?.uuid !== uuid) {
          return response.error(res, 'Unauthorized', 401);
        }
      }
      const userSevice = await UserService.getInstance();
      const userReservations = await userSevice.getReservations(uuid);
      if (userReservations === null) {
        console.success('User has not reservations');
        return response.success(res, 'User has not reservations');
      }
      console.success(`Reservations of: ${uuid}`);
      return response.success(res, userReservations);
    } catch (error) {
      console.error((error as Error)?.message);
      return response.error(res, (error as Error)?.message, 500);
    }
  });

/**
 * @api {POST} /users/ Create a new user
 * @apiName CreateUser
 * @apiGroup User
 * @apiPermission administrator
 */
router.post(
  '/',
  authMiddleware('administrator', response),
  validationMiddleware(createUser, response),
  async (req, res) => {
    const {
      name, lastName, email, phone, organization, password,
    } = req.body;
    const userService = await UserService.getInstance();
    const user = await userService.create(name, lastName, email, phone, organization, password);
    console.success(`CREATE USER: ${user.uuid}`);
    response.success(res, user);
  },
);

/**
 * @api {PUT} /users/:uuid Update a user
 * @apiName UpdateUser
 * @apiGroup User
 * @apiPermission administrator | user
 */
router.put(
  '/:uuid',
  authMiddleware(['user', 'administrator'], response, true),
  validationMiddleware(updateUser, response),
  async (req, res) => {
    try {
      const { uuid } = req.params;
      if (!req.body.administrator) {
        const authenticatedUser = req.body?.user as User;
        if (authenticatedUser?.uuid !== uuid) {
          return response.error(res, 'Unauthorized', 401);
        }
      }
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
  },
);

/**
 * @api {DELETE} /users/:uuid Delete a user
 * @apiName DeleteUser
 * @apiGroup User
 * @apiPermission administrator | user
 */
router.delete('/:uuid',
  authMiddleware(['user', 'administrator'], response, true),
  async (req, res) => {
    try {
      const { uuid } = req.params;
      if (!req.body.administrator) {
        const authenticatedUser = req.body?.user as User;
        if (authenticatedUser?.uuid !== uuid) {
          return response.error(res, 'Unauthorized', 401);
        }
      }
      const userService = await UserService.getInstance();
      const userDeleted = await userService.delete(uuid);
      console.success(`User deleted: ${uuid}`);
      return response.success(res, userDeleted);
    } catch (error) {
      console.error((error as Error)?.message);
      return response.error(res, (error as Error)?.message, 500);
    }
  });

export default router;