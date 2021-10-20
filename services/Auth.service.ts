/* eslint-disable class-methods-use-this */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getRepository, Repository } from 'typeorm';
import Auth from '../entities/Auth.entity';
import env from '../utils/Config';

export type AuthRole = 'administrator' | 'user';
class AuthService {
  private static authServiceInstance: AuthService;

  private authRepository: Repository<Auth>;

  static async getInstance() {
    if (!AuthService.authServiceInstance) {
      AuthService.authServiceInstance = new AuthService();
      AuthService.authServiceInstance.authRepository = getRepository(Auth);
    }
    return AuthService.authServiceInstance;
  }

  verifyToken(token: string) {
    return jwt.verify(token, env.api.secret);
  }

  generateToken(id: string, role: AuthRole): string {
    return jwt.sign(
      {
        id,
        role,
      },
      env.api.secret,
    );
  }

  async userLogin(email: string, password: string) {
    const auth = await this.authRepository.findOne({
      where: {
        user: {
          email,
        },
      },
      relations: ['user'],
    });
    if (!auth) {
      throw new Error('Credentials are not valid');
    }
    const isPasswordValid = await bcrypt.compare(password, auth.password);
    if (!isPasswordValid) {
      throw new Error('Credentials are not valid');
    }
    const token = this.generateToken(auth.user.uuid, 'user');
    return token;
  }

  async adminLogin(email: string, password: string) {
    const auth = await this.authRepository.findOne({
      where: {
        administrator: {
          email,
        },
      },
      relations: ['administrator'],
    });
    if (!auth) {
      throw new Error('Credentials are not valid');
    }
    const isPasswordValid = await bcrypt.compare(password, auth.password);
    if (!isPasswordValid) {
      throw new Error('Credentials are not valid');
    }
    const token = this.generateToken(auth.administrator.id.toString(), 'administrator');
    return token;
  }
}

export default AuthService;
