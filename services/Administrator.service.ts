import bcrypt from 'bcrypt';

class AdministratorService {
  private static administratorServiceInstance: AdministratorService;

  private administratorModel: any;

  private authModel: any;

  async getModels() {
    const { AdministratorModel, AuthModel } = await Database.getModels();
    this.administratorModel = AdministratorModel;
    this.authModel = AuthModel;
  }

  static async getInstance() {
    if (AdministratorService.administratorServiceInstance === null) {
      AdministratorService.administratorServiceInstance = new AdministratorService();
      await AdministratorService.administratorServiceInstance.getModels();
    }
    return AdministratorService.administratorServiceInstance;
  }

  async getAll() {
    return this.administratorModel.findAll();
  }

  async getOne(id: string) {
    return this.administratorModel.findOne({
      where: {
        id,
      },
    });
  }

  async create(name: string, lastName: string, email: string, password: string) {
    const administrator = await this.administratorModel.create({
      name,
      lastName,
      email,
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    const auth = await this.authModel.create({
      password: hashedPassword,
    });
    await administrator.setAuth(auth);
    return administrator;
  }

  async update(
    uuid: string,
    name?: string,
    lastName?: string,
    email?: string,
    password?: string,
  ) {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.administratorModel.findOne({
        where: { uuid },
        include: [{
          model: this.authModel,
        }],
      });
      const auth = await user.getAuth();
      await this.authModel.update({
        password: hashedPassword,
      }, {
        where: { id: auth.id },
      });
    }
    const administratorUpdated = await this.administratorModel.update({
      name,
      lastName,
      email,
    }, {
      where: { uuid },
      returning: true,
    });
    return administratorUpdated[1];
  }

  async delete(id: string) {
    const administrator = await this.administratorModel.findOne({
      where: { id },
      include: [{
        model: this.authModel,
      }],
    });
    const auth = await administrator.getAuth();
    await administrator.destroy();
    await auth.destroy();
    return administrator;
  }
}

export default AdministratorService;
