import Database from '../lib/Database';

class ReservationService {
  private static reservationServiceInstance: ReservationService;

  private reservationModel: any;

  private userModel: any;

  private courseModel: any;

  async getModels() {
    const { ReservationModel, UserModel, CourseModel } = await Database.getModels();
    this.reservationModel = ReservationModel;
    this.userModel = UserModel;
    this.courseModel = CourseModel;
  }

  static async getInstance() {
    if (ReservationService.reservationServiceInstance === null) {
      ReservationService.reservationServiceInstance = new ReservationService();
      await ReservationService.reservationServiceInstance.getModels();
    }
    return ReservationService.reservationServiceInstance;
  }

  async getAll() {
    return this.reservationModel.findAll();
  }

  async getOne(uuid: string) {
    return this.reservationModel.findOne({
      where: {
        uuid,
      },
    });
  }

  async create() { }

  async update() { }

  async delete() { }
}

export default ReservationService;
