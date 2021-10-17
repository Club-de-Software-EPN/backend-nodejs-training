import bcrypt from 'bcrypt';
import { getRepository, Repository } from 'typeorm';
import Administrator from '../entities/Administrator.entity';
import Auth from '../entities/Auth.entity';

class AdministratorService {
  private static administratorServiceInstance: AdministratorService;

  private administratorRepository: Repository<Administrator>;

  private authRepository: Repository<Auth>;

  static async getInstance() {
    if (AdministratorService.administratorServiceInstance === null) {
      AdministratorService.administratorServiceInstance = new AdministratorService();
      AdministratorService.administratorServiceInstance.administratorRepository = getRepository(
        Administrator,
      );
      AdministratorService.administratorServiceInstance.authRepository = getRepository(Auth);
    }
    return AdministratorService.administratorServiceInstance;
  }

  async getAll(): Promise<Administrator[]> {
    return this.administratorRepository.find({
      relations: ['auth', 'courses'],
    });
  }

  async getOne(id: number): Promise<Administrator> {
    const administrator = await this.administratorRepository.findOne({
      where: {
        id,
      },
      relations: ['auth', 'courses'],
    });
    if (!administrator) {
      throw new Error('Administrator not found');
    }
    return administrator;
  }

  async create(
    name: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<Administrator> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const administrator = this.administratorRepository.create({
      name,
      lastName,
      email,
      auth: {
        password: hashedPassword,
      },
    });
    return this.administratorRepository.save(administrator);
  }

  async update(
    id: number,
    name?: string,
    lastName?: string,
    email?: string,
    password?: string,
  ): Promise<Administrator> {
    if (!name && !lastName && !email && !password) {
      throw new Error('No data to update');
    }

    const administrator = await this.getOne(id);

    if (!administrator) {
      throw new Error('Administrator not found');
    }
    if (password) {
      administrator.auth.password = await bcrypt.hash(password, 10);
    }
    administrator.name = name || administrator.name;
    administrator.lastName = lastName || administrator.lastName;
    administrator.email = email || administrator.email;
    administrator.auth.password = password || administrator.auth.password;

    return this.administratorRepository.save(administrator);
  }

  async delete(id: number): Promise<Administrator> {
    const administrator = await this.getOne(id);
    if (!administrator) {
      throw new Error('Administrator not found');
    }
    return this.administratorRepository.remove(administrator);
  }
}

export default AdministratorService;
