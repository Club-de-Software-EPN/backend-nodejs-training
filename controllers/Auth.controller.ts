import express from 'express';

import Console from '../lib/Console';
import Response from '../lib/Response';
import AuthService from '../services/Auth.service';

const router = express.Router();

const apiConsole = new Console('AUTH-CONTROLLER');
const response = new Response();

/**
 * @api {POST}/auth/user Login user
 * @apiName loginUser
 * @apiGroup Auth
 * @apiPermission any
 */
router.post('/user', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return response.error(res, 'Email and password are required');
    }
    const authService = await AuthService.getInstance();
    const token = await authService.userLogin(email, password);
    res.cookie('token', token);
    return response.success(res, token);
  } catch (error) {
    apiConsole.error((error as Error)?.message);
    return response.error(res, (error as Error)?.message);
  }
});

/**
 * @api {POST}/auth/user Login administrator
 * @apiName loginUser
 * @apiGroup Auth
 * @apiPermission any
 */
router.post('/administrator', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return response.error(res, 'Email and password are required');
    }
    const authService = await AuthService.getInstance();
    const token = await authService.adminLogin(email, password);
    res.cookie('token', token);
    return response.success(res, token);
  } catch (error) {
    apiConsole.error((error as Error)?.message);
    return response.error(res, (error as Error)?.message);
  }
});

export default router;
