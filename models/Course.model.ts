import { Model, DataTypes, Sequelize } from 'sequelize';

class Course extends Model {
  static setup(sequelize: Sequelize) {
    Course.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endInscriptionDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      themes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'Course',
    });
  }
}

export default Course;