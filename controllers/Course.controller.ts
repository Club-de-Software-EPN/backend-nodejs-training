import express, { Request, Response as ExpressResponse } from 'express';

import CourseService from '../services/Course.service';
import { createCourse, updateCourse } from '../dtos/Course.dto';
import Console from '../lib/Console';
import Response from '../lib/Response';
import { authMiddleware } from '../middlewares/Auth';
import { validationMiddleware } from '../middlewares/Validation';
import User from '../entities/User.entity';
import Administrator from '../entities/Administrator.entity';

const router = express.Router();
const apiConsole = new Console('COURSE-CONTROLLER');
const response = new Response();

/**
 * @api {GET} /course Get all courses
 * @apiName getAllCourses
 * @apiGroup Courses
 * @apiPermission any
 */
router.get('/', async (req: Request, res: ExpressResponse) => {
  try {
    const courseService = await CourseService.getInstance();
    const courses = await courseService.getAll();
    apiConsole.success('Get all courses');
    response.success(res, courses);
  } catch (error) {
    console.error((error as Error)?.message);
    response.error(res, (error as Error)?.message, 500);
  }
});

/**
 * @api {GET} /course/:slug Get one course
 * @apiName getOneCourse
 * @apiGroup Courses
 * @apiPermission any
 */
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
    apiConsole.error(`${(error as Error)?.message}: ${req.params.slug}`);
    response.error(res, `${(error as Error)?.message}: ${req.params.slug}`, 400);
  }
});

/**
 * @api {POST} /course Add a course
 * @apiName AddeCourse
 * @apiGroup Courses
 * @apiPermission administrator
 */
router.post(
  '/',
  authMiddleware('administrator', response, true),
  validationMiddleware(createCourse, response),
  async (req: Request, res: ExpressResponse) => {
    try {
      const authenticatedAdministrator = req.body.administrator as Administrator;
      const {
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
        authenticatedAdministrator.id,
        name,
        description,
        startDate,
        endDate,
        endInscriptionDate,
        themes,
        price,
      );
      apiConsole.success(`CREATE COURSE: ${course.slug}`);
      response.success(res, course);
    } catch (error) {
      console.error((error as Error)?.message);
      response.error(res, (error as Error)?.message, 500);
    }
  },
);

/**
 * @api {PUT} /course/:slug Update Course
 * @apiName UpdateCourse
 * @apiGroup Courses
 * @apiPermission administrator
 */
router.put(
  '/:slug',
  authMiddleware('administrator', response, true),
  validationMiddleware(updateCourse, response),
  async (req: Request, res: ExpressResponse) => {
    try {
      const { slug } = req.params;
      const authenticatedAdministrator = req.body.administrator as Administrator;
      if (!authenticatedAdministrator.courses.find((course) => course.slug === slug)) {
        apiConsole.error(`Course not found${slug}`);
        return response.error(res, 'Course not found', 400);
      }
      const courseService = await CourseService.getInstance();
      const {
        name,
        description,
        startDate,
        endDate,
        endInscriptionDate,
        themes,
        price,
      } = req.body;
      const courseUpdated = await courseService.update(
        slug,
        name,
        description,
        startDate,
        endDate,
        endInscriptionDate,
        themes,
        Number(price),
      );
      apiConsole.success(`Course Updated: ${slug}`);
      return response.success(res, courseUpdated, 200);
    } catch (error) {
      console.error((error as Error)?.message);
      return response.error(res, (error as Error)?.message, 500);
    }
  },
);

/**
 * @api {DELETE} /course/:slug Delete one Course
 * @apiName DeleteCourse
 * @apiGroup Courses
 * @apiPermission administrator
 */
router.delete(
  '/:slug',
  authMiddleware('administrator', response, true),
  async (req: Request, res: ExpressResponse) => {
    try {
      const { slug } = req.params;
      const authenticatedAdministrator = req.body.administrator as Administrator;
      if (!authenticatedAdministrator.courses.find((course) => course.slug === slug)) {
        apiConsole.error(`Course not found${slug}`);
        return response.error(res, 'Course not found', 400);
      }
      const courseService = await CourseService.getInstance();
      const courseDeleted = await courseService.delete(slug);
      apiConsole.success(`Course Deleted ${slug}`);
      return response.success(res, courseDeleted);
    } catch (error) {
      console.error((error as Error)?.message);
      return response.error(res, (error as Error)?.message, 500);
    }
  },
);

/**
 * @api {GET} /course/:slug/reservations Get course reservations
 * @apiName GetCourse
 * @apiGroup Courses
 * @apiPermission administrator
 */
router.get(
  '/:slug/reservations',
  authMiddleware('administrator', response, true),
  async (req: Request, res: ExpressResponse) => {
    try {
      const { slug } = req.params;
      const authenticatedAdministrator = req.body.administrator as Administrator;
      if (!authenticatedAdministrator.courses.find((course) => course.slug === slug)) {
        apiConsole.error(`Course not found${slug}`);
        return response.error(res, 'Course not found', 400);
      }
      const courseService = await CourseService.getInstance();
      const reservations = await courseService.getAllReservations(slug);
      apiConsole.success('GET ALL RESERVATIONS');
      return response.success(res, reservations);
    } catch (error) {
      console.error((error as Error)?.message);
      return response.error(res, (error as Error)?.message, 500);
    }
  },
);

/**
 * @api {POST} /course/:slug/reservate Reservate a course
 * @apiName GetCourse
 * @apiGroup Courses
 * @apiPermission user
 */
router.post(
  '/:slug/reservate/',
  authMiddleware('user', response, true),
  async (req: Request, res: ExpressResponse) => {
    try {
      const { slug } = req.params;
      const authenticatedUser = req.body.user as User;
      const courseService = await CourseService.getInstance();
      const reservation = await courseService.addReservation(
        slug,
        authenticatedUser.uuid,
      );
      apiConsole.success(`CREATE RESERVATION: ${reservation.id}`);
      return response.success(res, reservation);
    } catch (error) {
      console.error((error as Error)?.message);
      return response.error(res, (error as Error)?.message, 400);
    }
  },
);

export default router;
