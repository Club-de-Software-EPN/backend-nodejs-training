import bcrypt from 'bcrypt';
import Database from '../lib/Database';

class UserService {
  private static userServiceInstance: UserService;

  private userModel: any;

  private authModel: any;

  private reservationModel: any;

  async getModels() {
    const { UserModel, AuthModel, ReservationModel } = await Database.getModels();
    this.userModel = UserModel;
    this.authModel = AuthModel;
    this.reservationModel = ReservationModel;
  }

  static async getInstance() {
    if (!UserService.userServiceInstance) {
      UserService.userServiceInstance = new UserService();
      await UserService.userServiceInstance.getModels();
    }
    return UserService.userServiceInstance;
  }

  async getAll() {
    return this.userModel.findAll();
  }

  async getOne(uuid: string) {
    return this.userModel.findOne({
      where: { uuid },
    });
  }

  async create(
    name: string,
    lastName: string,
    email: string,
    phone: string,
    organization: string,
    password: string,
  ) {
    const user = await this.userModel.create({
      email,
      name,
      lastName,
      phone,
      organization,
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    const auth = await this.authModel.create({
      password: hashedPassword,
    });
    await user.setAuth(auth);
    return user;
  }

  async update(
    uuid: string,
    email?: string,
    name?: string,
    lastName?: string,
    phone?: string,
    organization?: string,
    password?: string,
  ) {
    if (!email && !name && !lastName && !phone && !organization && !password) {
      throw new Error('Nothing to update');
    }
    if (password) {
      const user = await this.userModel.findOne({
        where: {
          uuid,
        },
        include: [{
          model: this.authModel,
        }],
      });
      if (!user) {
        throw new Error('uuid is not valid');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const auth = await user.getAuth();
      await this.authModel.update({
        password: hashedPassword,
      }, {
        where: {
          id: auth.id,
        },
      });
    }
    const result = await this.userModel.update({
      email,
      name,
      lastName,
      phone,
      organization,
    }, { where: { uuid }, returning: true });
    const user = result[1];
    return user[0];
  }

  async delete(uuid: string) {
    const user = await this.userModel.findOne({
      where: { uuid },
      include: [{
        model: this.authModel,
      }],
    });
    const auth = await user.getAuth();
    await user.destroy();
    await auth.destroy();
    return user;
  }

  async getReservations(uuid: string) {
    const user = await this.userModel.findOne({
      where: {
        uuid,
      },
    });
    if (!user) {
      throw new Error('uuid not found');
    }
    const userReservations = await this.reservationModel.findAll({
      where: {
        userId: user.id,
      },
    });
    if (userReservations.length === 0) {
      return null;
    }
    return userReservations;
  }
}

export default UserService;
