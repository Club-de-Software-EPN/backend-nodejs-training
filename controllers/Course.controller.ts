import express, { NextFunction, Request, Response as ExpressResponse } from 'express';
import { AnyObjectSchema } from 'yup';

import CourseService from '../services/Course.service';
import { createCourse, updateCourse } from '../dtos/Course.dto';
import Console from '../lib/Console';
import Response from '../lib/Response';

const router = express.Router();
const apiConsole = new Console('COURSE-CONTROLLER');
const response = new Response();

// eslint-disable-next-line max-len
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

// get all courses
router.get('/', async (req: Request, res: ExpressResponse) => {
  try {
    const courseService = await CourseService.getInstance();
    const courses = await courseService.getAll();
    apiConsole.success('Get all courses');
    response.success(res, courses.toString());
  } catch (error) {
    console.error((error as Error)?.message);
    response.error(res, (error as Error)?.message, 500);
  }
});

// get course by slug
router.get('/:slug', async (req: Request, res: ExpressResponse) => {
  try {
    const courseService = await CourseService.getInstance();
    const { slug } = req.params;
    const course = await courseService.getOne(slug);
    if (!course) {
      apiConsole.error(`Course not found${slug}`);
      response.error(res, 'Course not found', 400);
      return;
    }
    apiConsole.success('Get all users');
    response.success(res, course.toString());
  } catch (error) {
    console.error((error as Error)?.message);
    response.error(res, (error as Error)?.message, 500);
  }
});

// add new course
router.post(
  '/',
  validationMiddleware(createCourse),
  async (req: Request, res: ExpressResponse) => {
    apiConsole.success(req.body?.course);
    const {
      id,
      name,
      description,
      startDate,
      endDate,
      endInscriptionDate,
      themes,
      price,
    } = req.body;
    const courseService = await CourseService.getInstance();
    const course = await courseService.create(
      id,
      name,
      description,
      startDate,
      endDate,
      endInscriptionDate,
      themes,
      price,
    );
    apiConsole.success(`CREATE COURSE: ${course.slug}`);
    response.success(res, course.toString());
  },
);

// update course
router.put(
  '/:slug',
  validationMiddleware(updateCourse),
  async (req: Request, res: ExpressResponse) => {
    try {
      const { slug } = req.params;
      const courseService = await CourseService.getInstance();
      const {
        id,
        name,
        description,
        startDate,
        endDate,
        endInscriptionDate,
        themes,
        price,
      } = req.body;
      const courseUpdated = await courseService.update(
        id,
        name,
        description,
        startDate,
        endDate,
        endInscriptionDate,
        themes,
        price,
      );
      apiConsole.success(`Course Updated: ${slug}`);
      response.success(res, courseUpdated.toString(), 200);
      return;
    } catch (error) {
      console.error((error as Error)?.message);
      response.error(res, (error as Error)?.message, 500);
    }
  },
);

// delete course
router.delete(
  '/:slug',
  async (req: Request, res: ExpressResponse) => {
    try {
      const { slug } = req.params;
      if (!slug) {
        response.error(res, 'Data Missing', 400);
        return;
      }
      const courseService = await CourseService.getInstance();
      const courseDeleted = await courseService.delete(slug);
      apiConsole.success(`Course Deleted ${slug}`);
      response.success(res, courseDeleted.toString());
      return;
    } catch (error) {
      console.error((error as Error)?.message);
      response.error(res, (error as Error)?.message, 500);
    }
  },
);

// get all reservations
router.get('/:slug/reservations', async (req: Request, res: ExpressResponse) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      response.error(res, 'Data missing', 400);
      return;
    }
    const courseService = await CourseService.getInstance();
    const reservations = await courseService.getAllReservations(slug);
    apiConsole.success('GET ALL RESERVATIONS');
    response.success(res, reservations.toString());
  } catch (error) {
    console.error((error as Error)?.message);
    response.error(res, (error as Error)?.message, 500);
  }
});

router.post(
  '/:slug/reservate/',
  validationMiddleware(createCourse),
  async (req: Request, res: ExpressResponse) => {
    apiConsole.success(req.body?.course);
    const { slug } = req.params;
    const courseService = await CourseService.getInstance();
    const {
      uuid,
      expirationDate,
      totalPrice,
      paymenStatus,
      paymentImageUrl,
      paymentDate,
    } = req.body;
    const reservation = await courseService.addReservation(
      slug,
      uuid,
      expirationDate,
      totalPrice,
      paymenStatus,
      paymentImageUrl,
      paymentDate,
    );
    apiConsole.success(`CREATE RESERVATION: ${reservation.id}`);
    response.success(res, reservation.toString());
  },
);

export default router;
