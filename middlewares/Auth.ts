import { NextFunction, Response as ExpressResponse, Request } from 'express';
import Response from '../lib/Response';

const AuthService = require('../services/Auth.service');

const authMiddleware = (response: Response) => async (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return response.error(res, 'Unathorized', 401);
    }
    const token = authorization.split(' ')[1];
    const authService = await AuthService.getInstance();
    const payload = authService.verifyToken(token);
    if (!payload) {
      return response.error(res, 'Unathorized', 401);
    }
    req.body.user = payload;
    next();
    return null;
  } catch (e) {
    response.error(res, (e as Error).message, 401);
    return null;
  }
};

export default authMiddleware;
