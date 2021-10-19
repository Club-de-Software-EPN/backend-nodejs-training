import bcrypt from 'bcrypt';
import { getRepository, Repository } from 'typeorm';

import User from '../entities/User.entity';
import Reservation from '../entities/Reservation.entity';

class UserService {
  private static userServiceInstance: UserService;

  private userRepository: Repository<User>;

  private reservationRepository: Repository<Reservation>;

  static async getInstance() {
    if (!UserService.userServiceInstance) {
      UserService.userServiceInstance = new UserService();
      UserService.userServiceInstance.userRepository = getRepository(User);
    }
    return UserService.userServiceInstance;
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['auth', 'reservations'],
    });
  }

  async getOne(uuid: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { uuid },
      relations: ['auth', 'reservations'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async create(
    name: string,
    lastName: string,
    email: string,
    phone: string,
    organization: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      name,
      lastName,
      phone,
      organization,
      auth: {
        password: hashedPassword,
      },
    });
    return this.userRepository.save(user);
  }

  async update(
    uuid: string,
    email?: string,
    name?: string,
    lastName?: string,
    phone?: string,
    organization?: string,
    password?: string,
  ): Promise<User> {
    if (!email && !name && !lastName && !phone && !organization && !password) {
      throw new Error('Nothing to update');
    }

    const user = await this.getOne(uuid);

    if (!user) {
      throw new Error('User not found');
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.auth.password = hashedPassword;
    }

    user.name = name || user.name;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.organization = organization || user.organization;

    return this.userRepository.save(user);
  }

  async delete(uuid: string): Promise<User> {
    const user = await this.getOne(uuid);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userRepository.remove(user);
  }

  async getReservations(uuid: string): Promise<Reservation[]> {
    const user = await this.getOne(uuid);
    return user.reservations;
  }
}

export default UserService;
