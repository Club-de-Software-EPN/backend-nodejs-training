import { Model, DataTypes, Sequelize } from 'sequelize';

class Administrator extends Model {
  static setup(sequelize: Sequelize) {
    Administrator.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    }, {
      sequelize,
      modelName: 'Administrator',
    });
  }
}

export default Administrator;
