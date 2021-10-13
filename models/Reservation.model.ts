import { Model, DataTypes, Sequelize } from 'sequelize';

class Reservation extends Model {
  static setup(sequelize: Sequelize) {
    Reservation.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      paymentImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    }, {
      sequelize,
      modelName: 'Reservation',
    });
  }
}

export default Reservation;
