/* eslint-disable import/prefer-default-export */
import { NextFunction, Request, Response as ExpressResponse } from 'express';
import { AnyObjectSchema } from 'yup';

import Response from '../lib/Response';

export const validationMiddleware = (schema: AnyObjectSchema, response: Response) => async (
  req: Request,
  res: ExpressResponse,
  next: NextFunction,
) => {
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
