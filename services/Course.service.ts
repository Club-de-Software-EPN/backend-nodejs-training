import Administrator from '../entities/Administrator.entity';
import Reservation from '../entities/Reservation.entity';

class CourseService {
  private static courseServiceInstance: CourseService;

  private courseRepository: Repository<Course>;

  private administratorRepository: Repository<Administrator>;

  private reservationRepository: Repository<Reservation>;

  static async getInstance() {
    if (CourseService.courseServiceInstance == null) {
      CourseService.courseServiceInstance = new CourseService();
      CourseService.courseServiceInstance.courseRepository = getRepository(Course);
      CourseService.courseServiceInstance.administratorRepository = getRepository(Administrator);
      CourseService.courseServiceInstance.reservationRepository = getRepository(Reservation);
    }
    return CourseService.courseServiceInstance;
  }

  async getAll(): Promise<Course[]> {
    return this.courseRepository.find({
      relations: ['adminstrator', 'reservation'],
    });
  }

  async getOne(slug: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: {
        slug,
      },
      relations: ['administrator', 'reservation'],
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
    /** ¿Idenficar al administrador que crea el curso ? */
    const course = this.courseRepository.create({
      name,
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
    return course;
  }

  async update(
    slug: string,
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    endInscriptionDate: Date,
    themes: string[],
    price: number,
  ): Promise<Course> {
    if (!name && !description && !startDate && !endDate
      && !endInscriptionDate && !themes && !price) {
      throw new Error('No data to update');
    }

    const course = await this.getOne(slug);

    if (!course) {
      throw new Error('Course not found');
    }
    course.name = name;
    course.description = description;
    course.startDate = startDate;
    course.endDate = endDate;
    course.endInscriptionDate = endInscriptionDate;
    course.themes = themes;
    course.price = price;

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
        slug,
      },
      relations: ['user', 'course'],
    });
  }

  async addReservation(
    slug: string,
    uuid: string,
    expirationDate: string,
    totalPrice: number,
    paymenStatus: boolean,
    paymentImageUrl: string,
    paymentDate: Date,
  ): Promise<Reservation> {
    const reservation = this.reservationRepository.create({
      uuid,
      expirationDate,
      totalPrice,
      paymenStatus,
      paymentImageUrl,
      paymentDate,
      course: {
        slug,
      },
      user: {
        uuid,
      },
    });
    return this.reservationRepository.save(reservation);
  }
}

export default CourseService;
