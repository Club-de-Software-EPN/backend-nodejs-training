import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Database from '../lib/Database';

import env from '../utils/Config';

class AuthService {
  private static authServiceInstance: AuthService;

  private userModel: any;

  private authModel: any;

  private administratorModel: any;

  async getModels() {
    const { UserModel, AuthModel, AdministratorModel } = await Database.getModels();
    this.userModel = UserModel;
    this.authModel = AuthModel;
    this.administratorModel = AdministratorModel;
  }

  static async getInstance() {
    if (AuthService.authServiceInstance === null) {
      AuthService.authServiceInstance = new AuthService();
      await AuthService.authServiceInstance.getModels();
    }
    return AuthService.authServiceInstance;
  }

  verifyToken(token: string) {
    return jwt.verify(token, env.api.secret);
  }

  generateToken(uuid: string) {
    return jwt.sign(
      {
        uuid,
      },
      env.api.secret,
    );
  }

  async userLogin(email: string, password: string) {
    const user = await this.userModel.findOne({
      where: {
        email,
      },
      include: [{
        model: this.authModel,
      }],
    });
    if (!user) {
      throw new Error('Credentials are not valid');
    }
    const auth = await user.getAuth();
    const isPasswordValid = await bcrypt.compare(password, auth.password);
    if (!isPasswordValid) {
      throw new Error('Credentials are not valid');
    }
    const token = this.generateToken(user.uuid);
    return token;
  }

  async adminLogin(email: string, password: string) {
    return null;
  }
}

export default AuthService;
