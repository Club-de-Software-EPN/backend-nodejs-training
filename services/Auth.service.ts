/* eslint-disable class-methods-use-this */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getRepository, Repository } from 'typeorm';
import Auth from '../entities/Auth.entity';
import env from '../utils/Config';

class AuthService {
  private static authServiceInstance: AuthService;

  private authRepository: Repository<Auth>;

  static async getInstance() {
    if (AuthService.authServiceInstance === null) {
      AuthService.authServiceInstance = new AuthService();
      AuthService.authServiceInstance.authRepository = getRepository(Auth);
    }
    return AuthService.authServiceInstance;
  }

  verifyToken(token: string) {
    return jwt.verify(token, env.api.secret);
  }

  generateToken(uuid: string): string {
    return jwt.sign(
      {
        uuid,
      },
      env.api.secret,
    );
  }

  async userLogin(email: string, password: string) {
    const user = await this.authRepository.findOne({
      where: {
        email,
      },
      relations: ['user'],
    });
    if (!user) {
      throw new Error('Credentials are not valid');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credentials are not valid');
    }
    const token = this.generateToken(user.user.uuid);
    return token;
  }

  async adminLogin(email: string, password: string) {
    const administrator = await this.authRepository.findOne({
      where: {
        email,
      },
      relations: ['administrator'],
    });
    if (!administrator) {
      throw new Error('Credentials are not valid');
    }
    const isPasswordValid = await bcrypt.compare(password, administrator.password);
    if (!isPasswordValid) {
      throw new Error('Credentials are not valid');
    }
    const token = this.generateToken(`${administrator.administrator.id}`);
    return token;
  }
}

export default AuthService;
