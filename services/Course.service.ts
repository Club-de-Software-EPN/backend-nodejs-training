import Database from '../lib/Database';

class CourseService {
  private static courseServiceInstance: CourseService;

  private courseModel: any;

  private administratorModel: any;

  private reservationModel: any;

  async getModels() {
    const { CourseModel, AdministratorModel, ReservationModel } = await Database.getModels();
    this.courseModel = CourseModel;
    this.administratorModel = AdministratorModel;
    this.reservationModel = ReservationModel;
  }

  static async getInstance() {
    if (CourseService.courseServiceInstance === null) {
      CourseService.courseServiceInstance = new CourseService();
      await CourseService.courseServiceInstance.getModels();
    }
    return CourseService.courseServiceInstance;
  }

  async getAll() {
    return this.courseModel.findAll();
  }

  async getOne(slug: string) {
    return this.courseModel.findOne({
      where: {
        slug,
      },
    });
  }

  async create(
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    endInscriptionDate: Date,
    themes: string[],
    price: number,
  ) {
    /** ¿Idenficar al administrador que crea el curso ? */
    const course = await this.courseModel.create({
      name,
      slug: name.split(' ').join('-'),
      description,
      startDate,
      endDate,
      endInscriptionDate,
      themes,
      price,
    });
    /**
     * TODO: añadir el idAdmin a la fila del curso creado....
     */
    return course;
  }

  async update() { }

  async delete() { }

  async getAllReservations() { }

  async addReservation() { }
}

export default CourseService;
