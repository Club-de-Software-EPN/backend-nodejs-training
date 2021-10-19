import { getRepository, Repository } from 'typeorm';
import { addDays } from 'date-fns';
import Course from '../entities/Course.entity';
import Reservation from '../entities/Reservation.entity';
import User from '../entities/User.entity';

class CourseService {
  private static courseServiceInstance: CourseService;

  private courseRepository: Repository<Course>;

  private reservationRepository: Repository<Reservation>;

  private userRepository: Repository<User>;

  static async getInstance() {
    if (!CourseService.courseServiceInstance) {
      CourseService.courseServiceInstance = new CourseService();
      CourseService.courseServiceInstance.courseRepository = getRepository(Course);
      CourseService.courseServiceInstance.userRepository = getRepository(User);
      CourseService.courseServiceInstance.reservationRepository = getRepository(Reservation);
    }
    return CourseService.courseServiceInstance;
  }

  async getAll(): Promise<Course[]> {
    return this.courseRepository.find({
      relations: ['administrator', 'reservations'],
    });
  }

  async getOne(slug: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: {
        slug,
      },
      relations: ['administrator', 'reservations'],
    });
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  async create(
    id: number,
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    endInscriptionDate: Date,
    themes: string[],
    price: number,
  ): Promise<Course> {
    const slug = name.toLowerCase().replace(/ /g, '-');
    const course = this.courseRepository.create({
      name,
      slug,
      description,
      startDate,
      endDate,
      endInscriptionDate,
      themes,
      price,
      administrator: {
        id,
      },
    });
    return this.courseRepository.save(course);
  }

  async update(
    slug: string,
    name?: string,
    description?: string,
    startDate?: Date,
    endDate?: Date,
    endInscriptionDate?: Date,
    themes?: string[],
    price?: number,
  ): Promise<Course> {
    if (!name && !description && !startDate && !endDate
      && !endInscriptionDate && !themes && !price) {
      throw new Error('No data to update');
    }

    const course = await this.getOne(slug);

    if (!course) {
      throw new Error('Course not found');
    }
    course.name = name || course.name;
    course.description = description || course.description;
    course.startDate = startDate || course.startDate;
    course.endDate = endDate || course.endDate;
    course.endInscriptionDate = endInscriptionDate || course.endInscriptionDate;
    course.themes = themes || course.themes;
    course.price = price || course.price;

    return this.courseRepository.save(course);
  }

  async delete(slug: string): Promise<Course> {
    const course = await this.getOne(slug);
    if (!course) {
      throw new Error('Course not found');
    }
    return this.courseRepository.remove(course);
  }

  async getAllReservations(slug: string): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: {
        course: {
          slug,
        },
      },
      relations: ['user', 'course'],
    });
  }

  async addReservation(
    slug: string,
    uuid: string,
  ): Promise<Reservation> {
    const user = await this.userRepository.findOne({
      where: {
        uuid,
      },
      relations: ['reservations'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    const course = await this.courseRepository.findOne({
      where: {
        slug,
      },
      relations: ['reservations'],
    });
    if (!course) {
      throw new Error('Course not found');
    }
    const reservationExists = user.reservations.filter(
      (reservation) => course.reservations.filter((res) => res.id === reservation.id),
    );

    if (reservationExists.length > 0) {
      throw new Error('Reservation already exists');
    }

    const expirationDate = addDays(new Date(), 7);
    const reservation = this.reservationRepository.create({
      expirationDate,
      totalPrice: course.price,
      course,
      user,
    });
    const newReservation = await this.reservationRepository.save(reservation, {
      transaction: true,
    });
    const foundReservation = await this.reservationRepository.findOne({
      where: {
        id: newReservation.id,
      },
    });
    return foundReservation as Reservation;
  }
}

export default CourseService;
