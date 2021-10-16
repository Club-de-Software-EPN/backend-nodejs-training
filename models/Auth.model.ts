import { Model, DataTypes, Sequelize } from 'sequelize';

class Auth extends Model {
  static setup(sequelize: Sequelize) {
    Auth.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      password: {
        type: DataTypes.STRING,
      },
      isActiveAccount: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    }, {
      sequelize,
      modelName: 'auth',
    });
  }
}

export default Auth;
